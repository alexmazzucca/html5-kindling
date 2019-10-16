<?php get_header(); ?>

<!--
>>================================================================================>
Main Section
>>================================================================================>
-->

<section class="main">
	<div class="container">
		
		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
		
		<article class="result">
			<a href="<?php the_permalink(); ?>"><h3><?php the_title();  ?></h3></a>
			<p><?php the_excerpt(); ?></p>
		</article>
		
		<?php endwhile; else: ?>
		
		<h2>No Results Found.</h2>
		
		<?php endif; ?>
		
		<?php
		global $wp_query;
		$big = 999999999;
		?>
		
		<div class="pagination">
		
		<?php
		echo paginate_links(array(
			'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
			'format' => '?paged=%#%',
			'current' => max( 1, get_query_var('paged') ),
			'total' => $wp_query->max_num_pages
		));
		?>

		</div>
	</div>
</section>

<?php get_footer(); ?>