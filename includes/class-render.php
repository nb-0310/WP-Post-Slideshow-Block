<?php
if (!defined('ABSPATH')) {
    exit;
}

class PSB_Render {
    public static function render_slideshow_block($attributes) {
        // Extract attributes
        $url = isset($attributes['url']) ? esc_url($attributes['url']) : '';
        $showTitle = isset($attributes['showTitle']) ? $attributes['showTitle'] : true;
        $showExcerpt = isset($attributes['showExcerpt']) ? $attributes['showExcerpt'] : true;
        $itemsInView = isset($attributes['itemsInView']) ? intval($attributes['itemsInView']) : 1;
        $autoPlay = isset($attributes['autoPlay']) ? $attributes['autoPlay'] : true;
        $showCategories = isset($attributes['showCategories']) ? $attributes['showCategories'] : false;
        $showTags = isset($attributes['showTags']) ? $attributes['showTags'] : false;
        $showAuthor = isset($attributes['showAuthor']) ? $attributes['showAuthor'] : false;

        // Generate a unique cache key based on the attributes
        $cache_key = 'psb_slideshow_' . md5(serialize($attributes));

        // Try to get cached data
        $cached_output = wp_cache_get($cache_key, 'psb_slideshow');

        // If cached data exists, return it
        if ($cached_output !== false) {
            return $cached_output;
        }

        // Fetch posts from the API
        $posts = [];
        if ($url) {
            // Cache the API response for 1 hour (3600 seconds)
            $response = wp_remote_get($url . '/wp-json/wp/v2/posts', [
                'timeout' => 10,
                'sslverify' => false,
            ]);

            if (!is_wp_error($response)) {
                $posts_data = json_decode(wp_remote_retrieve_body($response), true);

                // Fetch additional details for each post
                foreach ($posts_data as $post_data) {
                    $post = [
                        'id' => $post_data['id'],
                        'title' => $post_data['title']['rendered'],
                        'excerpt' => $post_data['excerpt']['rendered'],
                        'link' => $post_data['link'],
                        'featured_media_url' => '',
                        'categories' => [],
                        'tags' => [],
                        'author' => __('Unknown Author', 'post-slideshow-block'),
                    ];

                    // Fetch featured media URL
                    if ($post_data['featured_media']) {
                        $media_response = wp_remote_get($url . '/wp-json/wp/v2/media/' . $post_data['featured_media']);
                        if (!is_wp_error($media_response)) {
                            $media_data = json_decode(wp_remote_retrieve_body($media_response), true);
                            $post['featured_media_url'] = $media_data['source_url'];
                        }
                    }

                    // Fetch categories
                    if (!empty($post_data['categories'])) {
                        foreach ($post_data['categories'] as $cat_id) {
                            $cat_response = wp_remote_get($url . '/wp-json/wp/v2/categories/' . $cat_id);
                            if (!is_wp_error($cat_response)) {
                                $cat_data = json_decode(wp_remote_retrieve_body($cat_response), true);
                                $post['categories'][] = $cat_data['name'];
                            }
                        }
                    }

                    // Fetch tags
                    if (!empty($post_data['tags'])) {
                        foreach ($post_data['tags'] as $tag_id) {
                            $tag_response = wp_remote_get($url . '/wp-json/wp/v2/tags/' . $tag_id);
                            if (!is_wp_error($tag_response)) {
                                $tag_data = json_decode(wp_remote_retrieve_body($tag_response), true);
                                $post['tags'][] = $tag_data['name'];
                            }
                        }
                    }

                    // Fetch author
                    if ($post_data['author']) {
                        $author_response = wp_remote_get($url . '/wp-json/wp/v2/users/' . $post_data['author']);
                        if (!is_wp_error($author_response)) {
                            $author_data = json_decode(wp_remote_retrieve_body($author_response), true);
                            $post['author'] = esc_html__($author_data['name'], 'post-slideshow-block');
                        }
                    }

                    $posts[] = $post;
                }
            }
        }

        // Start output buffering
        ob_start();

        // Render the slideshow
        if (!empty($posts)) {
            ?>
            <div class="slideshow-block" data-items-in-view="<?php echo esc_attr($itemsInView); ?>" data-autoplay="<?php echo esc_attr($autoPlay ? 'true' : 'false'); ?>">
                <div class="slides-container">
                    <div class="slides" style="transform: translateX(0%);">
                        <?php foreach ($posts as $index => $post) : ?>
                            <div class="slide" style="width: <?php echo 100 / $itemsInView; ?>%;">
                                <div class="slide-image" style="background-image: url(<?php echo esc_url($post['featured_media_url']); ?>); height: <?php echo $itemsInView === 1 ? 400 : ($itemsInView === 2 ? 300 : 200); ?>px;">
                                </div>

                                <div class="slide-content">
                                    <?php if ($showTitle) : ?>
                                        <h3 style="font-size:<?php echo max(12, 22 - ($itemsInView * 2)) ?>px;">
                                            <?php echo esc_html($post['title']); ?>
                                        </h3>
                                    <?php endif; ?>

                                    <?php if ($showCategories && !empty($post['categories'])) : ?>
                                        <div class="meta-info">
                                            <span><?php _e('Categories:', 'post-slideshow-block'); ?> <?php echo implode(', ', $post['categories']); ?></span>
                                        </div>
                                    <?php endif; ?>

                                    <?php if ($showTags && !empty($post['tags'])) : ?>
                                        <div class="meta-info">
                                            <span><?php _e('Tags:', 'post-slideshow-block'); ?> <?php echo implode(', ', $post['tags']); ?></span>
                                        </div>
                                    <?php endif; ?>

                                    <?php if ($showExcerpt) : ?>
                                        <p style="font-size:<?php echo max(12, 20 - ($itemsInView * 2)) ?>px;">
                                            <?php echo esc_html(wp_strip_all_tags($post['excerpt'])); ?>
                                        </p>
                                    <?php endif; ?>

                                    <?php if ($showAuthor) : ?>
                                        <div class="meta-info">
                                            <span><?php _e('Author:', 'post-slideshow-block'); ?> <?php echo esc_html($post['author']); ?></span>
                                        </div>
                                    <?php endif; ?>
                                </div>

                                <a href="<?php echo esc_url($post['link']); ?>" target="_blank" rel="noopener noreferrer" class="post-link">
                                    <button class="cta"><?php _e('Read More', 'post-slideshow-block'); ?></button>
                                </a>
                            </div>
                        <?php endforeach; ?>
                    </div>

					<div class="controls">
                        <button class="prev-btn">←</button>
                        <button class="next-btn">→</button>
                    </div>
                </div>
            </div>
            <?php
        } else {
            echo '<p>' . __('No posts found.', 'post-slideshow-block') . '</p>';
        }

        $output = ob_get_clean();
        wp_cache_set($cache_key, $output, 'psb_slideshow', 3600);
        return $output;
    }
}