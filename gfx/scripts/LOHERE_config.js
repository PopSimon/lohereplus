/**
 * @author simon
 */

var MAX_THUMB_WIDTH = 160;
var MAX_THUMB_HEIGHT = 160;

LOHERE.postHTMLString = function(postdata) {
    var date = new Date(postdata.date),
        thumb_size = {width:0, height:0};
    if (postdata.image.resolution.width > postdata.image.resolution.height) {
        thumb_size.width = MAX_THUMB_WIDTH;
        thumb_size.height = postdata.image.resolution.height * MAX_THUMB_WIDTH / postdata.image.resolution.width;
    } else {
        thumb_size.width = postdata.image.resolution.width * MAX_THUMB_HEIGHT / postdata.image.resolution.height;
        thumb_size.height = MAX_THUMB_HEIGHT;
    }
    
    //@formatter:off
	return ('<article id="' + postdata.id + '" ' + (("type" in postdata && (postdata.type != ""))? ('class="' + postdata.type + '"') : "") + '>' +
				'<footer>' +
					'<a href="#' + postdata.id + '" name="' + postdata.id + '">' + postdata.id  +'</a>' +
					'<p>' + postdata.poster + '</p>' +
					'<time pubdate datetime="' + postdata.date + '">' + date.toLocaleString() + '</time>' + 
				'</footer>' + 
				'<details>' +
					'<summary><a href="' + postdata.image.source + '">' + postdata.image.source + '</a></summary>' +
					'<dl>' + 
						'<dt>Felbontás: </dt><dd>' + postdata.image.resolution.width + '×' + postdata.image.resolution.height + '</dd>' + 
						'<dt>Méret:</dt><dd>' + postdata.image.size + ' kB</dd>' + 
					'</dl>' + 
				'</details>' +
				'<p>' +
				    //'<img src="' + postdata.image.thumbnail + '" alt="' + postdata.image.thumbnail + '" />' +
				    '<span class="thumbnail" style="width:' + thumb_size.width + 'px; height:' + thumb_size.height + 'px"></span>' + 
				    postdata.text +
			    '</p>' +
			'</article>');
    //@formatter:on
};
LOHERE.replyActionHandler = function(/*event*/e) {
    e.preventDefault();
    var link = '>>' + $(e.target).attr("href").match(/\d+/);
    LOHERE.msgform.txtarea.text(LOHERE.msgform.txtarea.text() + link + " ");
};
LOHERE.postPreviewActionHandler = function(/*event*/e) {
    e.preventDefault();
    var src_post = $(e.target).parents("article"), src_id = src_post.attr("id"), target_id = $(e.currentTarget).attr("href").match(/\d+/)[0];
    LOHERE.prevTree.create(src_id, LOHERE.createPreviewId(target_id, src_id));
    LOHERE.createPostPreview(target_id, src_post);
};
LOHERE.previewCloseActionHandler = function(/*event*/e) {
    console.log("a");
    var preview_id = $(e.target).parents(LOHERE.selectors.posts).attr("id");
    LOHERE.removePost(preview_id);
};
LOHERE.postFirstOnScreenActionHandler = function(/*event*/e) {
    var placeholder = $(e.target).find(LOHERE.selectors.post_image_thumbnail_placeholder),
        post_id = placeholder.parents("article").attr("id");
    setTimeout(function(placeholder) {
    placeholder.replaceWith('<img src="' + LOHERE.postdatas[post_id].image.thumbnail + '" alt="' + LOHERE.postdatas[post_id].image.thumbnail + '" class="' + LOHERE.selectors.thumbnail_class + '" />');
    }, 2000, placeholder);
};
LOHERE.postImgActionHandler = function(/*event*/e) {
    var img = $(e.target),
        post_id = img.parents("article").attr("id");
    img.toggleClass(LOHERE.selectors.thumbnail_class);
    if(img.hasClass(LOHERE.selectors.thumbnail_class)) {
        img.attr("src", LOHERE.postdatas[post_id].image.thumbnail);
    } else {
        img.attr("src", LOHERE.postdatas[post_id].image.source);
    }
};
//@formatter:off

//@formatter:on