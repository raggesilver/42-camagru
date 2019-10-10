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

        <video id="previewVideo" v-if="!error" autoplay="true"
          :src-object.prop.camel="previewSrc"
          v-show="!hasPreview"
        />
        <span v-else >{{ error }}</span>

        <canvas id="previewCanvas"
          v-show="hasPreview"
        />

        <div class="d-flex flex-ai-center p-3">
          <!-- Take picture button -->
          <button class="icon-button flex-1"
            v-show="!hasPreview"
            :disabled="!canTakePicture"
            @click="takePicture()"
          >
            <div class="d-block">
              <v-icon name="camera" />
            </div>
            <div class="d-block mt-1">
              <span>Take picture</span>
            </div>
          </button>
          <!-- Upload picture button -->
          <button class="icon-button flex-1"
            v-show="!hasPreview"
          >
            <div class="d-block">
              <v-icon name="file-upload" />
            </div>
            <div class="d-block mt-1">
              <span>Upload file</span>
            </div>
          </button>
          <!-- Discard picture button -->
          <button class="icon-button flex-1"
            v-show="hasPreview"
            @click="discardPicture()"
          >
            <div class="d-block">
              <v-icon name="trash" />
            </div>
            <div class="d-block mt-1">
              <span>Discard photo</span>
            </div>
          </button>
          <!-- Download picture button -->
          <button class="icon-button flex-1"
            v-show="hasPreview"
            @click="downloadPicture()"
          >
            <div class="d-block">
              <v-icon name="file-download" />
            </div>
            <div class="d-block mt-1">
              <span>Download photo</span>
            </div>
          </button>
        </div>

        <!-- Filter selection -->
        <div v-show="hasPreview" class="d-flex flex-jc-center p-3"
          style="align-items: flex-start; overflow-y: auto;">
          <div v-for="filter of filters" :key="filter.name">
            <button class="filter ml-1 mr-1"
              :style="{ ...(filter.css || {}), filter: filter.apply }"
              :class="{ active: currentFilter.name == filter.name }"
              @click="applyFilter(filter)"
            >
            </button>
            <small class="d-block mt-1">{{ filter.name }}</small>
          </div>
        </div>

        <!-- Publish section -->
        <div v-show="hasPreview" class="publish d-flex flex-col pl-2 pr-2">
          <!-- <span>Post</span> -->
          <div>
            <input type="text" placeholder="Say something about this picture"
              v-model="text">
          </div>
          <button class="suggested mt-2 ml-auto">Publish</button>
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
      canTakePicture: false,
      error: null,
      canvas: null,
      video: null,
      filters: [],
      currentFilter: null,
      hasPreview: false,
      originalPic: null,
      thumbCss: {},
      text: null
    };
  },
  methods: {
    /**
     * discardPicture()
     */
    discardPicture() {
      this.originalPic = null;
      this.hasPreview = false;
    },
    /**
     * applyFilter(filter)
     * - saves filter to this.currentFilter
     * - calls realApplyFilter if this.hasPreview
     */
    applyFilter(filter) {
      this.currentFilter = filter;
      if (this.hasPreview)
        this.realApplyFilter(this.canvas.getContext('2d'));
    },
    /**
     * takePicture()
     * - gets the current frame from the video
     * - draws it to the canvas
     * - copies the drawing to this.originalPic and sets this.hasPreview
     * - applies the image data to the filter buttons
     * - applies the filters to the filter buttons
     * - calls realApplyFilter
     */
    takePicture() {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;

      let ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.video, 0, 0,
                    this.video.videoWidth,
                    this.video.videoHeight);

      this.hasPreview = true;
      this.originalPic =
        ctx.getImageData(0, 0, this.video.videoWidth, this.video.videoHeight);
      let data = this.canvas.toDataURL('image/png');

      document.querySelectorAll('button.filter').forEach(el => {
        el.style['background-image'] = `url(${data})`;
        el.style['filter'] = this.filters;
      });

      this.realApplyFilter(ctx);
    },
    /**
     * realApplyFilter(ctx)
     * - reverts the canvas preview to this.originalPic
     * - applies new current filter then redraws
     */
    realApplyFilter(ctx) {
      ctx.filter = 'none';
      ctx.putImageData(this.originalPic, 0, 0);
      ctx.filter = this.currentFilter.apply;
      ctx.drawImage(this.canvas, 0, 0,
                    this.video.videoWidth,
                    this.video.videoHeight);
    },
    /**
     * downloadPicture()
     * - creates a virtual a tag
     * - sets it to a blob of this.canvas
     * - clicks the a tag to download
     */
    downloadPicture() {
      if (!this.hasPreview)
        return ;

      let a    = document.createElement('a');
      let name = `camagru-pic-${Date.now()}.png`;

      a.download = name;
      this.canvas.toBlob((blob) => {
        a.href = URL.createObjectURL(blob);
        a.click();
      });
    },
  },
  mounted() {
    this.video = document.createElement('video');
    this.canvas = document.getElementById('previewCanvas');

    this.filters = [
      {
        name: 'none',
        apply: 'none'
      },
      {
        name: 'black & white',
        apply: 'grayscale(100%)'
      },
      {
        name: 'sepia',
        apply: 'sepia(1)',
      },
      {
        name: 'x-ray',
        apply: 'invert(100%)',
      }
    ];

    this.currentFilter = this.filters[0];

    Camera.init()
      .then((stream) => {
        this.previewSrc = this.video.srcObject = stream;
        this.video.addEventListener('loadeddata', () => {
          this.canTakePicture = true;
        });
        this.video.play();
      })
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
  height: 100%;
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

video,
canvas {
  max-width: 100%;
  max-height: 300px;
  margin: 0 auto;
}

button.filter {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding: 0;
  border: none;
  background-size: cover;
  background-position: center;
  box-shadow:0 1px 2px rgba(0, 0, 0, .3);
}

button.filter.active {
  border: 2px solid black;
}

button.filter canvas {
  width: 50px;
  height: 50px;
}

.hidden {
  display: none;
}

input {
  width: 100%;
  border: none;
  padding: 1em;
  border-radius: 5px;
  box-shadow:0 2px 4px rgba(0, 0, 0, .18);
}

button.suggested {
  padding: .75em 1.5em;
  background: #42b983;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  border: none;
  box-shadow:0 1px 2px rgba(0, 0, 0, .18);
}
</style>
