<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class PSB_Block {
    public function __construct() {
        add_action( 'init', array( $this, 'register_block' ) );
		add_filter( 'block_categories_all', array( $this, 'custom_block_category' ), 0, 2 );
    }

    public function register_block() {
        register_block_type( 'post-slideshow/slideshow-block', array(
			'editor_script' => 'post-slideshow-block-js',
			'editor_style'  => 'post-slideshow-block-css',
			'attributes'     => array(
				'url' => array(
					'type'    => 'string',
					'default' => '',
				),
				'showTitle' => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'showExcerpt' => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'itemsInView' => array(
					'type'    => 'number',
					'default' => 1,
				),
				'showCategories'=> array(
					'type'=> 'boolean', 
					'default' => true,
				),
				'showTags'=> array(
					'type'=> 'boolean', 
					'default' => true,
				),
				'showAuthor'=> array(
					'type'=> 'boolean', 
					'default' => true
				),
				'autoPlay'=> array(
					'type'=> 'boolean',
					'default' => true,
				),
			),
			'render_callback' => array('PSB_Render', 'render_slideshow_block'),
		) );
    }

	public function custom_block_category($block_categories, $post) {
		return array_merge(
			$block_categories,
			array(
				array(
					'slug'  => 'post-slideshow',
					'title' => __( 'Post Slideshow', 'post-slideshow-block' ),
					'icon'  => ''
				)
			)
		);
	}
}
