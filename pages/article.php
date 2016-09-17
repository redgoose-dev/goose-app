<?php
if(!defined("__GOOSE__")){exit();}

// up like
if ($pref->json['article']['type'] == 'markdown')
{
	echo '<link rel="stylesheet" href="'.__GOOSE_ROOT__.'/vendor/Parsedown/markdown.css">';
}
?>

<section class="article" id="article">
	<header class="headding">
		<p class="location">
			<?=($data->nest) ? '<span>'.$data->nest['name'].'</span>' : ''?>
			<?=($data->category) ? '<span>'.$data->category['name'].'</span>' : ""?>
		</p>
		<h1><?=$data->article['title']?></h1>
		<p class="meta">
			<span><i class="fa fa-calendar-o"></i><em><?=$data->article['regdate']?></em></span>
			<span><i class="fa fa-eye"></i><em><?=$data->article['hit']?></em></span>
			<span><i class="fa fa-heart"></i><em data-bind="like"><?=($data->article['json']['like']) ? $data->article['json']['like'] : 0?></em></span>
		</p>
	</header>

	<div class="body">
		<?=$data->article['content']?>
	</div>

	<nav class="nav-bottom">
		<?php
		if ($pref->json['article']['updateLike'])
		{
			$disabled = (!isCookieKey( $pref->json['article']['cookiePrefix'].'like-'.$data->article['srl'], 7 )) ? ' disabled="disabeld"' : '';
			?>
			<button type="button" class="like" title="Like" data-srl="<?= $data->article['srl'] ?>"<?=$disabled?>>
				<i class="fa fa-heart"></i>
			</button>
			<?php
		}
		?>
	</nav>

	<nav class="external-buttons">
		<p>
			<a href="<?=__ROOT__?>/" class="btn close" title="close"><i class="fa fa-times"></i></a>
			<?=($data->next_srl) ?
				'<a href="'.__ROOT__.'/article/'.$data->next_srl.'/" class="btn prev" title="prev article"><i class="fa fa-angle-left"></i></a>' :
				'<span class="btn prev" title="prev article"><i class="fa fa-angle-left"></i></span>'
			?>
			<?=($data->prev_srl) ?
				'<a href="'.__ROOT__.'/article/'.$data->prev_srl.'/" class="btn next" title="next article"><i class="fa fa-angle-right"></i></a>' :
				'<span class="btn next" title="next article"><i class="fa fa-angle-right"></i></span>'
			?>
		</p>
	</nav>
</section>