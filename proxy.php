<?php

$url = $_GET['url'] ?? '';
if (empty($url)) {
  throw new \Exception('Url is empty');
}

$method = $_GET['method'] ?? 'GET';
if (empty($method)) {
  throw new \Exception('Method is empty');
}
if (!in_array($method, ['GET', 'POST'])) {
  throw new \Exception('Method is not allowed');
}

$data = $_GET['data'] ? urldecode($_GET['data']) : [];

$url = utf8_decode(urldecode($url));

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
if ($method === 'POST') {
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(json_decode($data)));
}
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

curl_close($ch);

echo $response;