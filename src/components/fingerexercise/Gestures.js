import { GestureDescription, Finger, FingerCurl } from "fingerpose";

const RockGesture = new GestureDescription("zero"); // ✊️
const PaperGesture = new GestureDescription("five"); // 🖐
const ScissorsGesture = new GestureDescription("two"); // ✌️
const ThreeGesture = new GestureDescription("three"); // 👌
const FourGesture = new GestureDescription("four"); // ✋
const OneGesture = new GestureDescription("one"); // ☝️

// zero
// -----------------------------------------------------------------------------

// thumb: half curled
// accept no curl with a bit lower confidence
RockGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
RockGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// all other fingers: curled
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  RockGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  RockGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

// five
// -----------------------------------------------------------------------------

// no finger should be curled
for (let finger of Finger.all) {
  PaperGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// two
//------------------------------------------------------------------------------

// index and middle finger: stretched out
ScissorsGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
ScissorsGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);

// ring: curled
ScissorsGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
ScissorsGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

// pinky: curled
ScissorsGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
ScissorsGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);

// three
//------------------------------------------------------------------------------

// index and middle finger: stretched out
ThreeGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
ThreeGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
ThreeGesture.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);

// pinky: curled
ThreeGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
ThreeGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);

ThreeGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
ThreeGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);

// four
//------------------------------------------------------------------------------

// thumb: half curled
// accept no curl with a bit lower confidence
FourGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
FourGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);

// all other fingers: stretched out
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  FourGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// one
//------------------------------------------------------------------------------

// index and middle finger: curled
RockGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
RockGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// Index: stretched out
OneGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);

// all other fingers: curled
for (let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
  OneGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  OneGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

export {
  RockGesture,
  PaperGesture,
  ScissorsGesture,
  ThreeGesture,
  FourGesture,
  OneGesture,
};
