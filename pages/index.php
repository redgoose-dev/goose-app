<?php
if(!defined("__GOOSE__")){exit();}
?>

<article class="photo-index" id="photoIndex">
	<header>
		<h1><?=($data['nest']['name']) ? $data['nest']['name'] : $pref->json['string']['intro_title']?></h1>
		<?php
		if (count($data['category']))
		{
		?>
			<nav>
				<ul class="category-index">
					<?php
					foreach ($data['category'] as $k=>$v)
					{
						$url = __ROOT__.'/index/'.$nest_id.'/';
						$url .= ($v['srl'] > 0) ? $v['srl'].'/' : '';
						$active = ($v['active']) ? 'class="active"' : '';
					?>
						<li <?=$active?>>
							<a href="<?=$url?>" data-key="<?=$v['srl']?>"><span><?=$v['name']?></span><em><?=$v['count']?></em></a>
						</li>
					<?php
					}
					?>
				</ul>
			</nav>
		<?php
		}
		?>
	</header>
	<?php
	if (count($data['articles']))
	{
	?>
		<div class="index grid">
			<div class="grid-sizer"></div>
			<?php
			foreach($data['articles'] as $k=>$v)
			{
			?>
				<div class="grid-item">
					<a href="<?=__ROOT__.'/article/'.$v['srl'].'/'?>">
						<figure>
							<img src="<?=__GOOSE_ROOT__.'/'.$v['json']['thumnail']['url']?>" alt="">
						</figure>
						<strong><?=$v['title']?></strong>
						<div class="meta">
							<span><i class="fa fa-eye"></i><em><?=$v['hit']?></em></span>
							<span><i class="fa fa-heart"></i><em><?=($v['json']['like']) ? $v['json']['like'] : 0?></em></span>
						</div>
					</a>
				</div>
			<?php
			}
			?>
		</div>
	<?php
	}
	else
	{
		echo '<div class="not-item"><i class="fa fa-folder-o"></i><span>not found item</span></div>';
	}
	?>

	<div class="loading-wrap"></div>

	<?php
	// paginate
	if ($data['pageNavigation'])
	{
		$nav = $data['pageNavigation'];
		$url_prev = ($nav->prev) ? makeLinkUrl($_target, $_params, [ 'keyword' => $_GET['keyword'], 'page' => $nav->prev['id'] ]) : '';
		$url_next = ($nav->next) ? makeLinkUrl($_target, $_params, [ 'keyword' => $_GET['keyword'], 'page' => $nav->next['id'] ]) : '';

		echo '<nav class="paginate">';
		if ($nav->prev)
		{
			echo "<a href=\"$url_prev\" title=\"".$nav->prev['name']."\" data-key=\"".$nav->prev['id']."\"><i class=\"fa fa-caret-left\"></i></a>";
		}
		foreach($nav->body as $k=>$o)
		{
			$url = ($o['active'] == false) ? makeLinkUrl($_target, $_params, [ 'keyword' => $_GET['keyword'], 'page' => (($o['id'] != 1) ? $o['id'] : null) ]) : '';
			echo ($o['active'] == true) ? "<strong>$o[name]</strong>" : "<a href=\"$url\" data-key=\"$o[id]\">$o[name]</a>";
		}
		if ($nav->next)
		{
			echo "<a href=\"$url_next\" title=\"".$nav->next['name']."\" data-key=\"".$nav->next['id']."\"><i class=\"fa fa-caret-right\"></i></a>";
		}
		echo '</nav>';
	}

	// next items
	if ($data['nextpage'])
	{
	?>
		<nav class="more-item">
			<button type="button" data-nextpage="<?=$data['nextpage']?>">
				<i class="icon-plus">plus</i>
			</button>
		</nav>
	<?php
	}
	?>
</article>
