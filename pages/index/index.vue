<template>
	<view class="box" @click="store.inc()">
		{{ store.counter }}
	</view>
</template>

<script setup>
	import { useStore } from '@/stores/counter.js'
	
	const store = useStore()
</script>


<style>
	.box {
		margin-top: 100px;
		text-align: center;
	}
</style>