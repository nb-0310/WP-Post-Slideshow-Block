<?php
/**
 * Plugin Name: Post Slideshow
 * Description: A custom Gutenberg block for creating beautiful and responsive slideshows.
 * Version: 1.0.0
 * Author: Nirzar Bhatt
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function spb_enqueue_block_assets() {
    wp_enqueue_script(
        'post-slideshow-block-js',
        plugins_url( 'dist/js/block.js', __FILE__ ),
        [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data' ],
        '1.0.0',
        true
    );

    wp_enqueue_style(
        'post-slideshow-block-css',
        plugins_url( 'dist/css/block.css', __FILE__ ),
        [],
        '1.0.0'
    );

    wp_register_script(
        'post-slideshow-block-frontend',
        plugins_url( '/dist/js/render.js', __FILE__ ),
        array( 'wp-element' ),
        filemtime( plugin_dir_path( __FILE__ ) . '/dist/js/render.js' ),
        true
    );

    register_block_type( 'post-slideshow/slideshow-block', array(
        'editor_script' => 'slideshow-pro-block-js',
        'editor_style'  => 'slideshow-pro-block-css',
        'render_callback' => 'render_dynamic_slideshow_block',
    ) );
}
add_action( 'init', 'spb_enqueue_block_assets' );

function render_dynamic_slideshow_block( $attributes ) {
    return '<div id="post-slideshow-block"></div>';
}

function enqueue_post_slideshow_block_frontend() {
    if ( is_admin() ) {
        return;
    }
    wp_enqueue_script( 'post-slideshow-block-frontend' );
}
add_action( 'wp_enqueue_scripts', 'enqueue_post_slideshow_block_frontend' );
