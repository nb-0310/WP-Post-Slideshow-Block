<?php
/**
 * Plugin Name: Post Slideshow
 * Description: A custom Gutenberg block for creating beautiful and responsive slideshows.
 * Version: 1.0.0
 * Author: Nirzar Bhatt
 * Text Domain: post-slideshow-block
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Autoload Classes
require_once plugin_dir_path( __FILE__ ) . 'includes/class-assets.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/class-block.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/class-render.php';

// Initialize Classes
new PSB_Assets();
new PSB_Block();
new PSB_Render();