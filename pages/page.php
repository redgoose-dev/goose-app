<?php
if(!defined("__GOOSE__")){exit();}
?>

<div class="article">
	<?php
	if (file_exists('pages/page/'.$_params['page'].'.html'))
	{
		require_once('pages/page/'.$_params['page'].'.html');
	}
	else
	{
	?>
		<section class="wrap page error">
			<div class="body">
				<h1>404</h1>
				<p class="message">page not found</p>
				<nav>
					<a href="<?= __ROOT__ ?>/" class="home" title="Home">
						<i class="fa fa-home"></i>
					</a>
				</nav>
			</div>
		</section>
	<?php
	}
	?>
</div>