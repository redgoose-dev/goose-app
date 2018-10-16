<template>
	<p>article page</p>
</template>

<script>
export default {
	name: 'article',
	components: {
		//
	},
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
}
</script>