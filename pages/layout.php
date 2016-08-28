<!doctype html>
<?php
$title = $pref->json['meta']['title'];
$title .= ($_target == 'index' && isset($data['nest']['name'])) ? ' - '.$data['nest']['name'] : '';
$title .= ($_target == 'index' && isset($data['category_name'])) ? ' - '.$data['category_name'] : '';
$title .= ($_target == 'article' && isset($data['article']['title'])) ? ' - '.$data['article']['title'] : '';

$description = ($_target == 'article' && isset($data['article']['content'])) ? renderDescription($data['article']['content']) : $pref->json['meta']['description'];

$class_html = ($_target == 'article') ? ' mode-article' : '';
$class_html .= ($_target == 'page') ? ' mode-page' : '';
$class_html = ($class_html) ? ' class="'.$class_html.'"' : '';
?>
<html lang="ko"<?=$class_html?>>
<head>
<meta charset="utf-8">
<title><?=$title?></title>
<meta name="viewport" content="user-scalable=yes, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<meta name="author" content="<?=$pref->json['meta']['author']?>">
<meta name="keywords" content="<?=$pref->json['meta']['keywords']?>">
<meta name="description" content="<?=$description?>">

<meta property="og:title" content="<?=$title?>">
<meta property="og:site_name" content="<?=__ROOT_URL__?>">
<meta property="og:url" content="<?=__ROOT_URL__.$_SERVER['REQUEST_URI']?>" />
<meta property="og:description" content="<?=$description?>">
<meta property="og:locale" content="ko_KR" />
<?=(isset($data['article']['json']['thumbnail']['url'])) ? '<meta property="og:image" content="'.__GOOSE_URL__.'/'.$data['article']['json']['thumbnail']['url'].'">' : ''?>

<link rel="stylesheet" href="<?=__ROOT__?>/dist/vendor/font-awesome/4.5.0/css/font-awesome.min.css">
<link rel="stylesheet" href="<?=__ROOT__?>/dist/vendor/noto-sans/fonts.css">
<link rel="stylesheet" href="<?=__ROOT__?>/dist/css/layout.pkgd.css">
</head>
<body>
<main>
	<header class="header" id="header">
		<h1>
			<a href="<?=__ROOT__?>">
				<img src="<?=__ROOT__?>/dist/images/img-logo.png" alt="<?=$pref->json['meta']['title']?>">
			</a>
		</h1>
		<nav class="toggle-buttons">
			<button type="button" data-target="gnb"><i class="fa fa-bars"></i></button>
			<button type="button" data-target="keyword-search"><i class="fa fa-search"></i></button>
			<button type="button" data-target="profile"><i class="fa fa-user"></i></button>
		</nav>
		<nav class="gnb">
			<?=(count($gnb->json['gnb'])) ? renderGNB($gnb->json['gnb'], 1) : ''?>
		</nav>
		<form action="<?=__ROOT__?>" method="get" class="keyword-search">
			<fieldset>
				<legend class="blind">keyword search form</legend>
				<input type="text" name="keyword" placeholder="Keyword" maxlength="15" value="">
				<button type="submit" title="search">
					<i class="fa fa-search"></i>
				</button>
			</fieldset>
		</form>
		<nav class="profile">
			<button type="button">
				<span class="blind">toggle profile</span>
				<i class="fa fa-user"></i>
				<i class="fa fa-angle-down"></i>
			</button>
			<div class="dropdown">
				<?=(count($gnb->json['profile'])) ? renderGNB($gnb->json['profile'], 1) : ''?>
			</div>
		</nav>
	</header>

	<div class="container">
		<?php
		if (file_exists($loc_container))
		{
			require_once($loc_container);
		}
		?>
	</div>

	<footer class="footer" id="footer">
		<p><?=$pref->json['string']['copyright']?></p>
	</footer>
</main>
<script src="<?=__ROOT__?>/dist/js/vendor.pkgd.js"></script>
<script>
function log(o){console.log(o);}
window.userData = {
	environment : {
		root : '<?=__ROOT__?>',
		gooseRoot : '<?=__GOOSE_ROOT__?>',
		target : '<?=$_target?>',
		params : JSON.parse(decodeURIComponent('<?=Util::arrayToJson($_params, true)?>')),
		page : parseInt('<?=($_GET['page']) ? (int)$_GET['page'] : 1?>'),
		keyword : '<?=($_GET['keyword']) ? $_GET['keyword'] : ''?>'
	},
	preference : JSON.parse(decodeURIComponent('<?=$pref->string?>'))
};
</script>
<script src="<?=__ROOT__?>/dist/js/app.pkgd.js"></script>
</body>
</html>