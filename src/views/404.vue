<!-- 结构 在一个 容器下面 -->
<template>
  <div>
     <!-- 外层容器 -->
        <div class="outer">
            <div class="inner_photo_title clearfix">
        		<!-- 设置图片 -->
        		<div class="photo">
        		    <img src="@/styles/images/404.png" alt="图片被吃掉啦o(╥﹏╥)o">
        		</div>

        		<!-- 设置标题 -->
        		<div class="title">
        			<img src="@/styles/images/404_6.png" alt="图片被吃掉啦o(╥﹏╥)o">
        		</div>
        	</div>

            <!-- 设置报错信息 -->
            <div class="info">
                <h2>page not found</h2>
                <p>您访问的页面不存在……</p>
            </div>

            <!-- 设置跳转首页按钮 -->
            <div class="btn">
                <a href="\">返回首页</a>
            </div>
        </div>

  </div>
</template>

<!-- 行为 -->
<script>

export default {
  name: 'Page404'
}
</script>

<!-- 样式  scoped局限范围在本块内-->
<style  >

/* 公共样式 */
.clearfix::before,
.clearfix::after{
	content: '';
	display: table;
	clear: both;
}


body{
  height: 50%;
	/* 全局背景色 */
	background-color: #2F4055;
}


/* 设置外层容器样式 */
.outer {
    width: 600px;
    padding: 10px;
    margin: 150px auto;

}

/* 设置装有图片和大标题的容器 */
.inner_photo_title{
	 width: 600px;
	 padding: 10px;
	 margin: 5px auto;
}

/* 设置图片样式 */
.photo {
    width: 100px;
    padding: 0 50px;
	/* 设置旋转 */
	transform:rotate(-13deg);
	/* 设置浮动 */
	float: left;
	margin: 10px 45px 0 30px;
}

/* 设置标题样式 */
.title{
	/* 设置旋转 */
	transform:rotate(8deg);
	/* 设置浮动 */
	float: left;
	padding: 0 10px;
	margin: 0 30px 0 45px;
}

/*  设置报错信息样式*/
.info{
	width: 600px;
	padding: 10px;
    text-align: center;
	color: #EEF0F2;
	/* 设置字重，即字体加粗 */
	font-weight: bold;
  }

.info h2{
	/* 1 em = 50 px */
	font-size: 2em;
	/* 设置字重，即字体加粗 */
	font-weight: bold;
	margin: 2px 15px;
	/* 块元素转为行内元素 */
	display: inline-block;
  }

  .info p{
	  /* 块元素转为行内元素 */
	  display: inline-block;
  }


/* 设置按钮样式 */
.btn{
    width: 200px;
    height: 40px;
    background-color: #67C23A;
    margin: 4px auto;
    border: rgb(0,0,0,.3) 1px solid;
    /* 设置水平居中 */
    text-align: center;
    /* 设置圆角 */
    border-radius: 40px;
    /* 设置阴影 */
    box-shadow: 4px 3px 2px 2px rgb(0, 0,0,.3);
}

/* 设置按钮里的链接样式 */
.btn a{
    font-size: 1.2em;
    font-family: 微软雅黑,'Courier New', Courier, monospace;
    text-decoration: none;
    color: #fff;
    /* 设置文字垂直居中 */
    line-height: 40px;
    /* 设置字间距 */
    letter-spacing: 4px;
}
.body{
  height: 100%;
	/* 全局背景色 */
	background-color: #2F4055;
}

</style>
