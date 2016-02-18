var gulp = require('gulp');
//简易服务器
var connect = require('gulp-connect');
// 自定重加载
var livereload = require('gulp-livereload');
//压缩css
var cssnano = require('gulp-cssnano');
// 压缩js
var uglify = require('gulp-uglify');
// 编译less
var less = require('gulp-less');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var autoprefix = new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });
// 合并css/js
var concat = require('gulp-concat');
// 图片处理
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
// 简易打包工具
var browserify = require("browserify");
var source = require("vinyl-source-stream");

gulp.task('default', ['webserver', 'watch']);
///////////////////////////////
//具体文件路径需要根据情况修改 ///
///////////////////////////////
/**
 * 压缩js代码
 */
gulp.task('compress', function () {
	return gulp.src('js/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('build/js'));
});
/**
 * 压缩css
 */
gulp.task('miniCss',['less'], function () {
	return gulp.src('css/**/*.css')
		.pipe(cssnano({discardComments: {removeAll: true}}))
		.pipe(gulp.dest('build/css'));
});
/**
 * 编译less
 */
gulp.task('less', function () {
	return gulp.src('less/**/*.less')
		.pipe(less())
		.pipe(gulp.dest('./css/cssFromLess'));
});
/**
 * 文件合并
 */
gulp.task('concat',['miniCss'], function() {
	gulp.src(['./css/cssFromLess/*.css','./css/hack.css'])    //- 需要处理的css文件，放到一个字符串数组里
		.pipe(concat('app.min.css'))                            //- 合并后的文件名
		.pipe(cssnano())
		.pipe(gulp.dest('build/css'));                               //- 输出文件本地

});
/**
 * 优化图片
 */
gulp.task('miniImage', function () {
	gulp.src('./img/**/*.{png,jpg,gif,ico}')
		.pipe(imagemin({
			optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
			progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
			interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
			multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
		}))
		.pipe(gulp.dest('./build/img'));
});
/**
 * 高度压缩图片
 */
gulp.task('deepMinimage', function () {
	gulp.src('./img/**/*.{png,jpg,gif,ico}')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
			use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
		}))
		.pipe(gulp.dest('./build/img'));
});
/**
 * commonJs简易打包工具
 */
gulp.task('browserify', function(){
  return browserify('index.js') //index.js为一个入口js
         // .transform(babelify)
         .bundle()
         .pipe(source('bundle.js')) //打包成一个js文件
         .pipe(gulp.dest('./build/js'));
});
/**
 * 监视的文件目录
 */
gulp.task('watch', function () {
	gulp.watch('*.html', ['reload-dev']);
	gulp.watch('js/**/*.js', ['reload-dev']);
	gulp.watch('css/**/*.css', ['reload-dev']);
});
gulp.task('reload-dev', function () {
	gulp.src('**/*.html')
		.pipe(connect.reload());
});
/**
 * web服务器
 */
gulp.task('webserver', function () {
	connect.server({
		root: '.',
		port: 9090,
		livereload: true//启用reload
	});
});
