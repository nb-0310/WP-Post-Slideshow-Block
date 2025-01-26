<?php
/**
 * Plugin Name: Gutenberg Block Plugin
 * Description: A custom Gutenberg block that fetches and displays data from the WP REST API.
 * Version: 1.0.0
 * Author: Your Name
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

function gbp_enqueue_block_assets() {
    wp_enqueue_script(
        'gutenberg-block-plugin-js',
        plugins_url( 'dist/js/block.min.js', __FILE__ ),
        [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data' ],
        '1.0.0',
        true
    );

    wp_enqueue_style(
        'gutenberg-block-plugin-css',
        plugins_url( 'dist/css/block.min.css', __FILE__ ),
        [],
        '1.0.0'
    );
}
add_action( 'enqueue_block_editor_assets', 'gbp_enqueue_block_assets' );

function gbp_register_block() {
    register_block_type( 'gbp/slideshow-block', [
        'editor_script' => 'gutenberg-block-plugin-js',
        'editor_style'  => 'gutenberg-block-plugin-css',
    ]);
}
add_action( 'init', 'gbp_register_block' );