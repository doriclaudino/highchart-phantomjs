<?php
ini_set( 'display_errors', true );
error_reporting( E_ALL );
 
 $filename = null;
if(isset($_GET["filename"]) && !empty($_GET["filename"]) && !is_null($_GET["filename"])) 
 $filename = $_GET["filename"];

$destinatarios = null;
if(isset($_GET["destinatarios"]) && !empty($_GET["destinatarios"]) && !is_null($_GET["destinatarios"])) 
  $destinatarios = $_GET["destinatarios"];

$nome_host = null;
if(isset($_GET["$nome_host"]) && !empty($_GET["$nome_host"]) && !is_null($_GET["$nome_host"])) 
  $$nome_host = $_GET["$nome_host"];

$periodo = null;
if(isset($_GET["$periodo"]) && !empty($_GET["$periodo"]) && !is_null($_GET["$periodo"])) 
  $periodo = $_GET["$periodo"];

 
require("PHPMailer/class.phpmailer.php"); // path to the PHPMailer class 
$mail = new PHPMailer();  
 
$mail->IsSMTP();  // telling the class to use SMTP
$mail->IsHTML(true);
$mail->Mailer = "smtp";
$mail->CharSet = "UTF-8";
$mail->Host = "mail.nvl.inf.br";
$mail->Port = 25;
$mail->SMTPAuth = true; // turn on SMTP authentication
$mail->Username = "faturamento@nvl.inf.br"; // SMTP username
$mail->Password = "faturamento2015"; // SMTP password 
$mail->FromName = "Faturamento NVL";
$mail->From     = "faturamento@nvl.inf.br";  
$mail->WordWrap = 50;  

$mail->Subject  = utf8_encode("Resumo de horas trabalhadas - $nome_host [$periodo]");

//parametro 3 indicas os remetentes separados por virgula
$enderecos = explode(",", $destinatarios,20);
for($i = 0; $i < Count($enderecos); $i++){
	$mail->AddAddress($enderecos[$i]);  
}

//$mail->AddAddress("dorival@nvl.inf.br");  
//$mail->AddAddress("dori.claudino@gmail.com"); 


$f = $filename;    //String file path
$size = filesize($f);  // File size (how much data to read)
$fH = fopen($f,"r");   // File handle
$corpo_email = fread($fH,$size);  // Read data from file handle
fclose($fH);  // Close handle
 

//verifica se tem body
if(!is_null($corpo_email)){
	$mail->Body = $corpo_email;
	
	//verifica se enviou email
	if(!$mail->Send()) {
		echo 'Message was not sent';
		echo 'Mailer error: ' . $mail->ErrorInfo;
	} else {
		echo 'Message has been sent';
	}	
}
?>
