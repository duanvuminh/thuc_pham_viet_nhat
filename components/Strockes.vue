<template>
  <div ref="object" class="d-flex flex-row mb-6 flex-wrap"></div>
</template>
<script>
export default {
  computed: {},
  data() {
    return {
      url: ""
    };
  },
  methods: {
    getSvgUrl(str) {
      return str.split("").map(x => {
        let cp = x.charCodeAt(0).toString(16);
        // return `/kanji/0${cp}.svg`;
        // return `https://cdn.rawgit.com/KanjiVG/kanjivg/r20160426/kanji/0${cp}.svg`;
        return this.$axios.get(`/api/strokes?id=${cp}`);
      });
    },
    async link(e, url) {
      await url.then(r => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(r.data.svg, "image/svg+xml");
        var d = doc.documentElement;
        e.appendChild(d);
        // console.log(d);
        const scheme = [
          "1976D2",
          "D32F2F",
          "388E3C",
          "FBC02D",
          "512DA8",
          "F57C00"
        ];
        const pathColors = scheme
          .map(
            (c, i) => `path:nth-child(${i + 1}) {
          stroke: #${c};
        }`
          )
          .join("\n");
        const timePerUnit = 0.01;
        let startTime = 0;
        const paths = d.querySelectorAll("path");
        const pathAnimations = Array.prototype.map
          .call(paths, path => {
            const length = path.getTotalLength();
            const id = path.id.replace(/(:|-)/g, "\\$1");
            const duration = timePerUnit * length;
            path.style.animationDelay = `${startTime}s`;
            path.style.strokeDasharray = `${length}`;
            path.style.animationDuration = `${duration}s`;
            startTime += duration;
            return `svg:hover #${id} {
            stroke-dashoffset: ${length};
          }`;
          })
          .join("\n");
        const style = doc.createElementNS("http://www.w3.org/2000/svg", "style");
        style.textContent = `
          ${pathColors}
          text {
            font-family: Noto, Roboto, sans-serif;
          }
          path {
            stroke-dashoffset: 0;
          }
          svg:hover path {
            opacity: 0;
            animation: draw 1s ease-in-out forwards;
          }
          text {
            transition: .15s;
          }
          svg:hover text {
            opacity: 0;
          }
          @keyframes draw {
            0% {
              opacity: 1;
            }
            to {
              opacity: 1;
              stroke-dashoffset: 0;
            }
          }
          ${pathAnimations}
        `;
        d.children[0].appendChild(style);
      });
    }
  },
  mounted() {
    this.urls = this.getSvgUrl(this.kanji);
    this.urls.forEach((url,index) => {
      this.link(this.$refs.object, url);
    });
  },
  props: ["kanji"],
  watch: {}
};
</script>
