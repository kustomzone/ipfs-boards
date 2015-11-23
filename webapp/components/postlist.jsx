var React = require('react')
var sortedIndex = require('lodash.sortedindex')
var Icon = require('icon.jsx')

module.exports = function(boardsAPI){
  var Post = require('post.jsx')(boardsAPI)
  return React.createClass({
    getInitialState: function(){
      return { posts: [], api: false }
    },
    sortFn: function(a,b){
      return (b.date || 0) - (a.date || 0)
    },
    init: function(boards){
      this.setState({ api: true })
      boards.getPostsInBoard(this.props.admin,this.props.board)
      .on('post in '+this.props.board+'@'+this.props.admin,(post,hash) => {
        if(!this.isMounted()) return true
        var now = (new Date()).getTime()
        var posts = this.state.posts
        if(post.date === undefined || post.date <= 0){
          posts.push(post)
        } else if(post.date <= now){
          var i = sortedIndex(posts,post,(p) => now-p.date || now)
          posts.splice(i,0,post)
        } else {
          console.log('Post discarded cause date in the future:',post)
        }
        this.setState({ posts })
      })
    },
    componentDidMount: function(){
      boardsAPI.use(boards => {
        if(boards.isInit) this.init(boards)
        else boards.getEventEmitter().on('init',err => {
          if(!err && this.isMounted()) this.init(boards)
        })
      })
    },
    getPosts: function(){
      if(this.state.posts.length > 0 || this.state.api){
        return this.state.posts.map(post => {
          return <Post key={post.hash} board={this.props.board} admin={this.props.admin} post={post} />
        })
      } else return <div className="center-block text-center">
        <Icon name="refresh" className="fa-3x center-block light fa-spin" />
      </div>
    },
    render: function(){
      return (
        <div className="postList">
          {this.getPosts()}
        </div>
      )
    }
  })
}