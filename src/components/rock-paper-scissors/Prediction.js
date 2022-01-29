import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";
import * as imgs from "./SampleImage";
import * as fp from "./fingerpose-master";
import { RockGesture, PaperGesture, ScissorsGesture } from "./Gestures";

// const GE = new fp.GestureEstimator([
//     fp.Gestures.VictoryGesture,
//     fp.Gestures.ThumbsUpGesture
// ]);

const GE = new fp.GestureEstimator([
  RockGesture,
  PaperGesture,
  ScissorsGesture,
]);

let handposeModel;
let intervalID;

const Prediction = {
  init: async function () {
    // Load the MediaPipe handpose model.
    console.log("Loading handpose model...");
    handposeModel = await handpose.load();
    console.log("Model loaded");

    console.log("Warm up model");
    const sample = await imgs.SampleImage.create();
    console.log("smaple created");
    await handposeModel.estimateHands(sample, false);
    const sample1 = await imgs.SampleImage1.create();
    console.log("smaple1 created");
    await handposeModel.estimateHands(sample1, false);
    console.log("Model is hot!");
  },

  main: async function (setGestureName, setGestureScore) {
    console.log("main()");

    const startPredict = () => {
      intervalID = setInterval(async () => {
        // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain a
        // hand prediction from the MediaPipe graph.
        // console.log('predicting...');
        const predictions = await handposeModel.estimateHands(
          document.querySelector("video")
        );
        // console.log('prediction done');

        if (predictions.length > 0) {
          /*
                    `predictions` is an array of objects describing each detected hand, for example:
                    [
                    {
                        handInViewConfidence: 1, // The probability of a hand being present.
                        boundingBox: { // The bounding box surrounding the hand.
                        topLeft: [162.91, -17.42],
                        bottomRight: [548.56, 368.23],
                        },
                        landmarks: [ // The 3D coordinates of each hand landmark.
                        [472.52, 298.59, 0.00],
                        [412.80, 315.64, -6.18],
                        ...
                        ],
                        annotations: { // Semantic groupings of the `landmarks` coordinates.
                        thumb: [
                            [412.80, 315.64, -6.18]
                            [350.02, 298.38, -7.14],
                            ...
                        ],
                        ...
                        }
                    }
                    ]
                    */

          for (let i = 0; i < predictions.length; i++) {
            const keypoints = predictions[i].landmarks;

            const estimatedGestures = GE.estimate(predictions[i].landmarks, 9);
            const { posData, gestures } = estimatedGestures;
            if (gestures.length > 0) {
              // console.log(gestures[0].name);
              setGestureName(gestures[0].name);
              setGestureScore(gestures[0].score);
            } else {
              // console.log('none');
              setGestureName("none");
              setGestureScore(0);
            }

            // Log hand keypoints.
            // for (let i = 0; i < keypoints.length; i++) {
            //     const [x, y, z] = keypoints[i];
            //     console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
            // }
          }
        }
      }, 200);
    };

    startPredict();
  },

  stop: function () {
    clearInterval(intervalID);
  },
};

export default Prediction;
