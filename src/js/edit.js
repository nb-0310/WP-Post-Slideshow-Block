import { __ } from '@wordpress/i18n';
import { useState, useEffect, useCallback, useRef } from '@wordpress/element';
import { PanelBody, PanelRow, TextControl, ToggleControl, RangeControl, Button } from '@wordpress/components';
import { InspectorControls, BlockControls, useBlockProps } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { Icon, category, tag, postAuthor, arrowRight, arrowLeft } from '@wordpress/icons';
import '../css/index.css';

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const { url, showTitle, showExcerpt, itemsInView } = attributes;
	const [isEditing, setIsEditing] = useState(!url);
	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);

	const blockProps = useBlockProps();
	const slideImageRef = useRef(null);
	const controlsRef = useRef(null);

	const handleUrlChange = useCallback((newUrl) => {
		setAttributes({ url: newUrl });
	}, []);

	const handleDoneClick = useCallback(() => {
		setIsEditing(false);
		fetchPosts(url);
	}, [url]);

	const fetchPosts = async (apiUrl) => {
		if (!apiUrl) return;
		setIsLoading(true);
		try {
			const response = await fetch(`${apiUrl}/wp-json/wp/v2/posts?_embed`);
			const postsData = await response.json();

			const postsWithDetails = postsData.map((post) => {
				const featured_media_url = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
				const categories =
					post._embedded?.['wp:term']?.find((terms) => terms.some((term) => term.taxonomy === 'category')) ||
					[];
				const tags =
					post._embedded?.['wp:term']?.find((terms) => terms.some((term) => term.taxonomy === 'post_tag')) ||
					[];
				const author = post._embedded?.author?.[0]?.name || __('Unknown Author', 'post-slideshow-block');

				return {
					...post,
					featured_media_url,
					categories: categories.map((cat) => cat.name),
					tags: tags.map((tag) => tag.name),
					author,
				};
			});

			setPosts(postsWithDetails);
		} catch (error) {
			console.error(__('Error fetching posts:', 'post-slideshow-block'), error);
		} finally {
			setIsLoading(false);
		}
	};

	const goToNext = useCallback(() => {
		const maxIndex = Math.max(0, posts.length - itemsInView);
		setCurrentIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : 0));
	}, [posts.length, itemsInView]);

	const goToPrev = useCallback(() => {
		const maxIndex = Math.max(0, posts.length - itemsInView);
		setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : maxIndex));
	}, [posts.length, itemsInView]);

	const stripHTML = (html) => {
		const doc = new DOMParser().parseFromString(html, 'text/html');
		return doc.body.textContent || '';
	};

	useEffect(() => {
		if (url) {
			fetchPosts(url);
		}
	}, [url]);

	useEffect(() => {
		if (slideImageRef.current && controlsRef.current) {
			const imageCoordinates = slideImageRef.current.getBoundingClientRect();
			controlsRef.current.style.top = `${imageCoordinates.height / 2}px`;
		}
	}, [posts, isLoading]);

	useEffect(() => {
		let interval;

		if (attributes.autoPlay && posts.length > 0) {
			interval = setInterval(() => {
				goToNext();
			}, 1200);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [attributes.autoPlay, posts.length, goToNext]);

	return (
		<div {...blockProps}>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton icon="edit" label={__('Edit URL', 'post-slideshow-block')} onClick={() => setIsEditing(true)} />
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Slideshow Settings', 'post-slideshow-block')} initialOpen={true}>
					<PanelRow>
						<TextControl
							label={__('API URL', 'post-slideshow-block')}
							value={url}
							onChange={handleUrlChange}
							help={__('Enter the API URL to fetch posts from.', 'post-slideshow-block')}
							placeholder="https://rtcamp.com/"
						/>
					</PanelRow>

					{isEditing && (
						<PanelRow>
							<Button isPrimary onClick={handleDoneClick} disabled={isLoading}>
								{__('Load Slideshow', 'post-slideshow-block')}
							</Button>
						</PanelRow>
					)}

					<PanelRow>
						<ToggleControl
							label={__('Enable Autoplay', 'post-slideshow-block')}
							checked={attributes.autoPlay}
							onChange={() => setAttributes({ autoPlay: !attributes.autoPlay })}
						/>
					</PanelRow>
				</PanelBody>

				<PanelBody title={__('Content Display', 'post-slideshow-block')} initialOpen={true}>
					<PanelRow>
						<ToggleControl
							label={__('Show Title', 'post-slideshow-block')}
							checked={attributes.showTitle}
							onChange={() => setAttributes({ showTitle: !attributes.showTitle })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show Categories', 'post-slideshow-block')}
							checked={attributes.showCategories}
							onChange={() => setAttributes({ showCategories: !attributes.showCategories })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show Tags', 'post-slideshow-block')}
							checked={attributes.showTags}
							onChange={() => setAttributes({ showTags: !attributes.showTags })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show Author', 'post-slideshow-block')}
							checked={attributes.showAuthor}
							onChange={() => setAttributes({ showAuthor: !attributes.showAuthor })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show Excerpt', 'post-slideshow-block')}
							checked={attributes.showExcerpt}
							onChange={() => setAttributes({ showExcerpt: !attributes.showExcerpt })}
						/>
					</PanelRow>
				</PanelBody>

				<PanelBody title={__('Layout Settings', 'post-slideshow-block')} initialOpen={true}>
					<RangeControl
						label={__('Items in View', 'post-slideshow-block')}
						value={itemsInView}
						onChange={(value) => setAttributes({ itemsInView: value })}
						min={1}
						max={3}
						step={1}
						marks
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>

			{isEditing ? (
				<div>
					<TextControl
						label={__('Enter URL', 'post-slideshow-block')}
						value={url}
						onChange={handleUrlChange}
						placeholder="https://rtcamp.com/"
					/>
					<Button isPrimary onClick={handleDoneClick}>
						{__('Done', 'post-slideshow-block')}
					</Button>
				</div>
			) : isLoading ? (
				<p>{__('Loading...', 'post-slideshow-block')}</p>
			) : (
				<div className="slides-container">
					<div
						className="slides"
						style={{
							transform: `translateX(-${(currentIndex * 100) / itemsInView}%)`,
						}}
					>
						{posts.map((post, index) => (
							<div
								className={`slide ${
									index >= currentIndex && index < currentIndex + itemsInView ? 'active' : ''
								}`}
								key={post.id}
								style={{
									width: `${100 / itemsInView}%`,
								}}
							>
								<div
									ref={slideImageRef}
									className="slide-image"
									style={{
										backgroundImage: `url(${post.featured_media_url})`,
										height: `${itemsInView === 1 ? 400 : itemsInView === 2 ? 300 : 200}px`,
									}}
								/>

								<div className="slide-content">
									{showTitle && (
										<h3
											style={{
												fontSize: `${Math.max(12, 22 - itemsInView * 2)}px`,
											}}
										>
											{stripHTML(post.title.rendered)}
										</h3>
									)}

									{attributes.showCategories && post.categories.length > 0 && (
										<div className="meta-info">
											<Icon icon={category} />
											{post.categories.map((category) => (
												<span key={category} className="meta-text">
													{category}
												</span>
											))}
										</div>
									)}

									{attributes.showTags && post.tags.length > 0 && (
										<div className="meta-info">
											<Icon icon={tag} />
											{post.tags.map((tag) => (
												<span key={tag} className="meta-text">
													{tag}
												</span>
											))}
										</div>
									)}

									{showExcerpt && (
										<p
											style={{
												fontSize: `${Math.max(12, 20 - itemsInView * 2)}px`,
											}}
										>
											{stripHTML(post.excerpt.rendered)}
										</p>
									)}

									{attributes.showAuthor && (
										<div className="meta-info">
											<Icon icon={postAuthor} />
											<span className="meta-text">{post.author}</span>
										</div>
									)}
								</div>

								<a href={post.link} target="_blank" rel="noopener noreferrer" className="post-link">
									<button className="cta">{__('Read More', 'post-slideshow-block')}</button>
								</a>
							</div>
						))}
					</div>

					<div ref={controlsRef} className="controls">
						<button onClick={goToPrev} className="prev-btn">
							<Icon icon={arrowLeft} />
						</button>
						<button onClick={goToNext} className="next-btn">
							<Icon icon={arrowRight} />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Edit;