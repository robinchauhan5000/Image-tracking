import { loadGLTF, loadAudio } from "./libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
  const start = async () => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "./assets/targets.mind",
    });
    const { renderer, scene, camera } = mindarThree;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const raccoon = await loadGLTF("./assets/fryd/fryd.glb");

    console.log("raccoon", raccoon);

    // scene.add(raccoon.scene);

    // // Find the animation clip
    // const animation = raccoon.animations[0];

    // // Create an animation mixer
    // const mixer = new THREE.AnimationMixer(raccoon.scene);

    // // Start the animation
    // const action = mixer.clipAction(animation).play();

    // // action.play();
    // // Render the scene
    // renderer.render(scene, camera);

    raccoon.scene.scale.set(0.8, 0.8, 0.8);
    raccoon.scene.position.set(0, 0.2, 0.15);
    raccoon.scene.rotation.set(0, 4.75, 30);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(raccoon.scene);

    const audioClip = await loadAudio("./assets/oursound.mp3");

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const audio = new THREE.PositionalAudio(listener);
    anchor.group.add(audio);

    audio.setBuffer(audioClip);
    audio.setRefDistance(100);
    audio.setLoop(true);

    anchor.onTargetFound = () => {
      audio.play();
    };
    anchor.onTargetLost = () => {
      audio.pause();
    };

    await mindarThree.start();
    if (raccoon.animations.length) {
      var mixer = new THREE.AnimationMixer(raccoon.scene);
      console.log("mixer", mixer);
      await raccoon.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
      });
    }
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };
  start();
});
