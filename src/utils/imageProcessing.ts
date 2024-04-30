declare var ml5: any

export const clasifier = ml5.imageClassifier(
  "/models/personal-model/model.json",
  () => {
    console.log("model loaded")
  }
)
