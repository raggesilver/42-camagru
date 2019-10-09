<template>
  <div class="upload">
    <div class="popup">
      <div class="header d-flex flex-ai-center">
        <span class="flex-1">Photo</span>
        <!-- <button>Photo</button> -->
        <button class="icon-button p-3">
          <v-icon name="times" />
        </button>
      </div>
      <div class="content">
        <!-- Error div -->
        <div class="error">
          <span v-if="error">{{ error }}</span>
          <video v-if="previewSrc"
          :src-object.prop.camel="previewSrc" autoplay="true" />
        </div>
        <div class="d-flex flex-ai-center p-3">
          <button class="icon-button flex-1" :disabled="!previewSrc">
            <div class="d-block">
              <v-icon name="camera" />
            </div>
            <div class="d-block mt-1">
              <span>Take picture</span>
            </div>
          </button>
          <button class="icon-button flex-1">
            <div class="d-block">
              <v-icon name="file-upload" />
            </div>
            <div class="d-block mt-1">
              <span>Upload file</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Camera from "@/modules/camera";

export default {
  data() {
    return {
      previewSrc: null,
      error: null
    };
  },
  mounted() {
    Camera.init()
      .then((stream) => this.previewSrc = stream)
      .catch((err) => {
        this.error = "Can't access camera :(";
        console.log(err);
      });
  }
}
</script>

<style scoped>
.upload {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .6);
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  width: 90%;
  max-width: 400px;
  height: 90%;
  background: white;
  border-radius: 6px;
  position: relative;
  padding-top: 45px;
}

.content {
  overflow-y: auto;
  max-height: 100%;
}

.header {
  height: 45px;
  position: absolute;
  top: 0;
  left: 0;
  background: white;
  width: 100%;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.header > button {
  position: absolute;
  right: 0;
  height: 45px;
}

video {
  max-width: 100%;
  max-height: 300px;
  margin: 0 auto;
}
</style>
