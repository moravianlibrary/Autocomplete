#!/usr/bin/php
<?php
require 'File/MARC.php';

$config = parse_ini_file("config.ini", true);
$parser_settings = array();

function main() {
   delete_index();
   index();
   save_index();
   optimize_index();
}

function execute_solr_request($path, $post, $content_type) {
   global $config;
   $ch = curl_init();
   $url = $config['solr']['url'] . $path;
   curl_setopt($ch, CURLOPT_URL, $url);
   if ($post != null) {
      curl_setopt($ch, CURLOPT_POST, true);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $post); 
   }
   if ($content_type != null) {
      curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: $content_type"));
   }
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
   $response = curl_exec($ch);
   if (!$response) {
     die("Solr request failed (url is $url), make sure solr server is running and correctly set up.\n");
   }
   return $response;
}

function delete_index() {
   $delete_xml = "<delete><query>*:*</query></delete>";
   $response = execute_solr_request("/update", $delete_xml, "text/xml");
}

function save_index() {
   global $config;
   $post = array(
      "file_box" => "@" . $config['output']['file'],
   );
   $response = execute_solr_request("/update/csv?commit=true&separator=%7C&fieldnames=count,field,key", $post, null);
}

function optimize_index() {
   $response = execute_solr_request("/update?optimize=true", null, null);
}

function index() {
   global $config;
   global $parser_settings;
   foreach($config["fields"] as $key => $value) {
      $result = array();
      foreach(split(":", $value) as $val) {
         preg_match("/([0-9]*)([a-zA-Z]*)/S", $val, &$matches);
            $result[] = array("field" => $matches[1], "subfields" => $matches[2]);
      }
      $parser_settings[$key] = $result;
   }
   $summary = array();
   foreach($config["files"]["file"] as $file) {
      process_file($summary, $file);
   }
   $fh = fopen($config['output']['file'], "w");
   foreach($summary as $key => $values) {
      foreach ($values as $keyword => $count) {
         $key = str_replace("|", " ", $key);
         $keyword = str_replace("|", " ", $keyword);
         fwrite($fh, "$count|$key|$keyword\n");
      }
   }
   fclose($fh);
}

function process_file(&$summary, $file) {
   $count = 0;
   $records = new File_MARC($file);
   while ($record = $records->next()) {
      $result = process_record($record);
      foreach($result as $key => $vals) {
         if (!isset($summary[$key])) {
            $summary[$key] = array();
         }
         foreach ($vals as $val) {
            if (!isset($summary[$key][$val])) {
               $summary[$key][$val] = 1;
            } else {
               $summary[$key][$val]++;
            }
         }
      }
      $count++;
      if ($count % 20 == 0) {
          file_put_contents('php://stderr', "$file $count\r    ");
      }
   }
   file_put_contents('php://stderr', "$file done\n     ");
}

function process_record($record) {
   global $config;
   $result = array();
   foreach($config['fields'] as $key => $value) {
      $result[$key] = extract_value($record, $key);
   }
   if (isset($result["author"][0]) && isset($result["title"][0])) {
      $result["author_title"] = array($result["author"][0] . " : " . $result["title"][0]);
   }
   return $result;
}

function extract_value($record, $spec) {
   global $parser_settings;
   $results = array();
   foreach($parser_settings[$spec] as $desc) {
      $field = $desc["field"];
      $subfields = $desc["subfields"];
      $result = "";
      for($i=0; $i<strlen($subfields); $i++) {
         $subfield = $subfields[$i];
         $field_value = $record->getField($field);
         if ($field_value) {
            $sub_field_value = $record->getField($field)->getSubfield($subfield);
            if ($sub_field_value) {
               $result .= clean($sub_field_value->getData()) . " ";
            }
         }
      }
      $result = trim($result);
      if ($result != "") {
         $results[] = trim($result);
      }
   }
   return $results;
}

function clean($text) {
   $text = preg_replace("/(:|;|\/|\.)*$/S", "", $text);
   $text = str_replace('"', "", $text);
   return $text;
}

main();

?>
