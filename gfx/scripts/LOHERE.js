/**
 * @author simon
 */
var LOHERE = (function() {'use strict';
    /**
     * A representation of a directed tree. The nodes can have multiple children
     * (target nodes / forward links) and one parent (source node / backward link)
     * The linking is done by id-s.
     * @param data_remove_callback: this function is called with the appropriate id
     * (string) when a node is removed from the LinkTree.
     */
    function LinkTree(/*callback(data)*/data_remove_callback) {
        this.tree = {};
        this.datarmcallback = data_remove_callback;
    }


    LinkTree.prototype.exists = function(/*id*/postid) {
        return this.tree.hasOwnProperty(postid);
    };
    LinkTree.prototype.getNode = function(/*id*/postid) {
        return this.tree[postid];
    };
    LinkTree.prototype.create = function(/*id*/sourceid, /*id*/targetid) {
        if(this.exists(sourceid)) {
            if(!this.exists(targetid)) {
                this.tree[targetid] = new this.LinkNode(targetid, this.tree[sourceid], null);
                this.tree[sourceid].addForwardLink(this.tree[targetid]);
            } else {
                if(!(this.tree[sourceid].existsInForwardLinks(this.tree[targetid]))) {
                    this.tree[sourceid].addForwardLink(this.tree[targetid]);
                } else {
                    throw new Error("Node already exists");
                }
            }
        } else {
            if(!this.exists(targetid)) {
                this.tree[sourceid] = new this.LinkNode(sourceid, null, null);
                this.tree[targetid] = new this.LinkNode(targetid, this.tree[sourceid], null);
                this.tree[sourceid].addForwardLink(this.tree[targetid]);
            } else {
                this.tree[sourceid] = new this.LinkNode(sourceid, null, [this.tree[targetid]]);
                this.tree[targetid].setBackwardLink(this.tree[sourceid]);
            }
        }
    };
    LinkTree.prototype.remove = function(/*LinkNode*/target) {
        if(this.exists(target.id) && this.tree[target.id] === target) {
            target.runOnEachForwardLink( function(i) {
                this.remove(i);
            }.bind(this));
            if(target.hasBackwardLink()) {
                target.backwardLink.removeForwardLink(target);
                if(!target.backwardLink.hasBackwardLink() && !target.backwardLink.hasForwardLinks()) {
                    this.datarmcallback(target.backwardLink.id);
                    delete this.tree[target.backwardLink.id];
                }
            }
            this.datarmcallback(target.id);
            delete this.tree[target.id];
        } else {
            throw new Error("Node doesn't exists");
        }
    };
    /**
     * A Node in a LinkTree. It has its own id (string) and links to its children /
     * target nodes / forward links, and a link to its only parent / source node /
     * backward link
     * @param id: The id of the current node [string]
     * @param source_node: reference to the parent node [LinkNode]
     * @param target_nodes: references to the child nodes [LinkNode arra]
     */
    LinkTree.prototype.LinkNode = function(/*id*/id, /*LinkNode*/source_node, /*[LinkNode]*/target_nodes) {
        var i;
        this.id = id;
        this.backwardLink = source_node;
        this.forwardLinks = {};
        if( target_nodes instanceof Array) {
            for( i = 0; i < target_nodes.length; ++i) {
                this.forwardLinks[target_nodes[i].id] = target_nodes[i];
            }
        }
    };
    LinkTree.prototype.LinkNode.prototype.setBackwardLink = function(/*LinkNode*/source_node) {
        this.backwardLink = source_node;
    };
    LinkTree.prototype.LinkNode.prototype.addForwardLink = function(/*LinkNode*/target_node) {
        this.forwardLinks[target_node.id] = target_node;
    };
    LinkTree.prototype.LinkNode.prototype.removeForwardLink = function(/*LinkNode*/target_node) {
        delete this.forwardLinks[target_node.id];
    };
    LinkTree.prototype.LinkNode.prototype.existsInForwardLinks = function(/*LinkNode*/target_node) {
        return this.forwardLinks.hasOwnProperty(target_node.id);
    };
    LinkTree.prototype.LinkNode.prototype.hasBackwardLink = function() {
        return !!this.backwardLink;
    };
    LinkTree.prototype.LinkNode.prototype.hasForwardLinks = function() {
        return !jQuery.isEmptyObject(this.forwardLinks);
    };
    LinkTree.prototype.LinkNode.prototype.runOnEachForwardLink = function(/*function*/f) {
        var i;
        for(i in this.forwardLinks) {
            f(this.forwardLinks[i]);
        }
    };
    /**
     * Module object
     */
    return {
        board : "b",
        postdatas : {
            add : function(postdata) {
                this[postdata.id] = postdata;
            },
            remove : function(post_id) {
                delete this[post_id];
            }
        },
        selectors : {
            posts : "article",
            preview_class : "preview",
            preview_posts : "article.preview",
            post_titlebar : " > footer",
            post_reply : " > footer > a",
            post_reply_links : "> p > a.reply",
            post_image : "> p > img",
            post_image_thumbnail_placeholder : "> p > span.thumbnail",
            thumbnail_class : "thumbnail",
            thumbnail_version : ".thumbnail",
            full_version : ""
        },
        /**
         * DOM elements
         */
        thread : null,
        msgform : {
            pinimg : null,
            txtarea : null
        },
        prevTree : new LinkTree(function(rm_id) {
            if(LOHERE.isPreviewId(rm_id)) {
                LOHERE.thread.find(rm_id).remove();
                LOHERE.postdatas.remove(rm_id);
            }
        }),
        init : function() {
            if(this.replyActionHandler) {
                this.thread.delegate(this.selectors.posts + this.selectors.post_reply, "click", this.replyActionHandler);
            }
            if(this.postPreviewActionHandler) {
                this.thread.delegate(this.selectors.posts + this.selectors.post_reply_links, "click", this.postPreviewActionHandler);
            }
            if(this.previewCloseActionHandler) {
                this.thread.delegate(this.selectors.preview_posts + this.selectors.post_titlebar, "click", this.previewCloseActionHandler);
            }
            if(this.postImgActionHandler) {
                this.thread.delegate(this.selectors.posts + this.selectors.post_image, "click", this.postImgActionHandler);
            }
            // Sometimes works, sometimes not - probably a bug in the plugin
            /*if(this.postFirstOnScreenActionHandler) {
                this.thread.delegate(this.selectors.posts, "appear", this.postFirstOnScreenActionHandler);
            }*/
        },
        /**
         * Network handlers
         */
        getPostData : function(/*int*/post_id) {
            if(!this.postdatas.hasOwnProperty(post_id)) {
                /**
                 * TODO: AJAX request
                 */
                var postdata = test_posts[post_id];
                /**
                 * /TODO
                 */
                this.postdatas.add(postdata);
                return postdata;
            }
            return this.postdatas[post_id];
        },
        getPostDatas : function(/*int[]*/post_ids) {
            var i, results = [], requests = [], responses = {}, tmp_id, tmp_indx;
            for( i = 0; i < post_ids.length; ++i ) {
                if(this.postdatas.hasOwnProperty(post_ids[i])) {
                    results[i] = this.postdatas[post_ids[i]];
                } else {
                    requests.push([post_ids[i], i]);
                }
            }
            /**
             * TODO: AJAX request
             */
            for( i = 0; i < requests.length; ++i) {
                tmp_id = requests[i][1];
                if(test_posts.hasOwnProperty(tmp_id)) {
                    responses[tmp_id] = test_posts[tmp_id];
                }
            }
            /**
             * /TODO
             */
            for( i = 0; i < requests.length; ++i) {
                tmp_id = requests[i][1];
                tmp_indx = requests[i][2];
                this.postdatas.add(responses[tmp_id]);
                results[tmp_indx] = responses[tmp_id];
            }
            return results;
        },
        getAllPostData : function(/*int*/thread_id) {
            var i, results = [];
            /**
             * TODO: AJAX request
             */
            for(i in test_posts) {
                this.postdatas.add(test_posts[i]);
                results.push(test_posts[i]);
            }
            /**
             * /TODO
             */
            return results;
        },
        /**
         * DOM string Templates
         */
        postHTMLString : function(postdata) {
            throw new Error("NotImplementedException: function must be implemented before use");
        },
        createPreviewId : function(/*string*/target_id, /*string*/source_id) {
            return source_id + "_" + target_id;
        },
        isPreviewId : function(id) {
            return (id.search(/_/) === -1) ? false : true;
        },
        /**
         * DOM handlers
         */
        createPostElement : function(postdata) {
            var result = $(this.postHTMLString(postdata));
            result.appear(this.postFirstOnScreenActionHandler);
            return result;
        },
        createPostPreviewElement : function(postdata) {
            var result = this.createPostElement(postdata);
            result.addClass(this.selectors.preview_class);
            return result;
        },
        createPostElements : function(/*postdata[]*/postdatas) {
            var i, s = "", postdata, results, htmlstring = "";
            for( i = 0; i < postdatas.length; ++i) {
                s = this.postHTMLString(postdatas[i]);
                htmlstring += s;
            }
            results = $(htmlstring);
            results.appear(this.postFirstOnScreenActionHandler);
            return results;
        },
        createPosts : function(post_ids) {
            this.thread.append(this.createPostElements(post_ids));
        },
        createPostPreview : function(/*int*/post_id, /*jQuery element*/originalpost) {
            var postdata = this.getPostData(post_id), post;
            postdata.id = this.createPreviewId(postdata.id, originalpost.attr("id"));
            post = this.createPostPreviewElement(postdata);
            this.postdatas.add(postdata);
            originalpost.before(post);
            return post;
        },
        removePost : function(/*int*/id) {
            if(this.prevTree.exists(id)) {
                this.prevTree.remove(this.prevTree.getNode(id));
            }
            this.thread.find('#' + id).remove();
        },
        /**
         * Event handlers
         */
        replyActionHandler : null,
        postPreviewActionHandler : null,
        imgToFullActionHandler : null,
        imgToThumbnailActionHandler : null,
        previewCloseActionHandler : null,
        postFirstOnScreenActionHandler : null
    };
}());
