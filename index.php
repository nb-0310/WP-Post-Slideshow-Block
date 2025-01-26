<?php
/**
 * Plugin Name: Slideshow Pro Block
 * Description: A custom Gutenberg block for creating beautiful and responsive slideshows, powered by the WP REST API.
 * Version: 1.0.0
 * Author: Your Name
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

function spb_enqueue_block_assets() {
    wp_enqueue_script(
        'slideshow-pro-block-js',
        plugins_url( 'dist/js/block.min.js', __FILE__ ),
        [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data' ],
        '1.0.0',
        true
    );

    wp_enqueue_style(
        'slideshow-pro-block-css',
        plugins_url( 'dist/css/block.min.css', __FILE__ ),
        [],
        '1.0.0'
    );
}
add_action( 'enqueue_block_editor_assets', 'spb_enqueue_block_assets' );

function spb_register_block() {
    register_block_type( 'spb/slideshow-block', [
        'editor_script' => 'slideshow-pro-block-js',
        'editor_style'  => 'slideshow-pro-block-css',
    ]);
}
add_action( 'init', 'spb_register_block' );
