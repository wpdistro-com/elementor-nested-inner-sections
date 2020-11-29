<?php

/**
 * Plugin Name:       Unlimited Nested Inner Sections
 * Plugin URI:        https://github.com/mozkomor05
 * Description:       Allows you to add unimited amount of nested inner sections.
 * Version:           1.0
 * Author:            mozko
 * License:           GPL-3.0
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}

define("NIS_PATH", plugin_dir_path(__FILE__));
define("NIS_URL", plugins_url('\\', __FILE__));

add_action( 'plugins_loaded', 'plugin_load' );

/**
 * Load Elements
 *
 * Load the plugin after Elementor (and other plugins) are loaded.
 *
 * @since 1.0
 */
function plugin_load() {
	load_plugin_textdomain( 'nested-inner-sections' );

	if ( ! did_action( 'elementor/loaded' ) ) {
		add_action( 'admin_notices', 'plugin_load_fail' );

		return;
	}

	add_action( 'elementor/editor/after_enqueue_scripts', 'after_enqueue_scripts' );
}

function after_enqueue_scripts() {
	$path = "assets/js/unlimited-inner-sections.js";
	wp_enqueue_script('nested-inner-section-elementor-plugin', NIS_URL . $path, [], filemtime(NIS_PATH . $path));
}

/**
 * Handles admin notice for non-active
 * Elementor plugin situations
 *
 * @since 0.1.0
 */
function plugin_load_fail() {
	$class   = 'notice notice-error';
	$message = sprintf( __( 'You need %1$s"Elementor"%2$s for the %1$s"Unlimited Nested Inner Sections"%2$s plugin to work.', 'nested-inner-sections' ), '<strong>', '</strong>' );

	printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), $message );
}
