<template> <!-- 这里要把<template></template>里面的<div></div>也去掉只放插入代码 -->
      <div class="nav-breadcrumb-wrap">
        <div class="container">
          <nav class="nav-breadcrumb">
            <a href="/">Home</a>
            <slot name="bread"></slot>  <!-- 插槽，在不同页面显示不同东西 -->
            <slot name="B"></slot>  <!-- 添加多个插头也行的 -->
          </nav>
        </div>
      </div>
</template>
<!-- 面包屑 -->