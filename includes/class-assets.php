<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class PSB_Assets {
    public function __construct() {
		add_action('plugins_loaded', array( $this, 'post_slideshow_block_load_textdomain' ) );
        add_action( 'init', array( $this, 'register_assets' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
    }

	public function post_slideshow_block_load_textdomain() {
		load_plugin_textdomain(
			'post-slideshow-block',
			false,
			dirname(plugin_basename(__FILE__)) . '/languages'
		);
	}

    public function register_assets() {
        wp_enqueue_style('dashicons');

		// Enqueueing the block editor scripts and styles
		wp_enqueue_script(
			'post-slideshow-block-js',
			plugins_url( 'wp-post-slideshow-block/dist/block.js' ),
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data' ),
			'1.0.0',
			true
		);

		wp_enqueue_style(
			'post-slideshow-block-css',
			plugins_url( 'wp-post-slideshow-block/dist/block.css' ),
			array(),
			'1.0.0'
		);

		wp_register_script(
			'post-slideshow-block-frontend',
			plugins_url( 'wp-post-slideshow-block/dist/render.js' ),
			array( 'wp-element' ),
			'1.0.0',
			true
		);
    }

    public function enqueue_frontend_assets() {
        if ( ! is_admin() ) {
            wp_enqueue_script( 'post-slideshow-block-frontend' );
        }
    }
}
