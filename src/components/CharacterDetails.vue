<template>
  <div>
    <img :src="characterImage" alt="Character Image" />
    <div>
      <h3>{{ characterName }}</h3>
      <p>{{ characterRace }}</p>
      <p>{{ characterDescription }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CharacterDetails',
  data() {
    return {
      characterImage: 'path/to/your/image.png', // 您可以更改此路径
      characterName: '角色名称',
      characterRace: '角色种族',
      characterDescription: '角色特点描述'
    };
  }
}
</script>
