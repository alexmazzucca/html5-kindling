<?php get_header(); ?>

<!--
>>================================================================================>
Main Section
>>================================================================================>
-->

<section class="main">
	<div class="container">
		<article>
			<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
			<h2><?php the_title(); ?></h2>
			<?php the_content(); ?>
			<?php endwhile; endif; ?>
		</article>
	</div>
</section>

<?php get_footer(); ?>