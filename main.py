from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model_core import DisasterInferenceEngine
import io
from pathlib import Path
from PIL import Image, UnidentifiedImageError
import os

app = FastAPI(title="DisasterLens Multi-Modal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = DisasterInferenceEngine(model_path=str(Path(__file__).with_name("multi_disaster_model.onnx")))

@app.get("/")
def read_root():
    return {"status": "Online", "message": "DisasterLens ONNX API is running successfully"}

@app.post("/analyze/")
@app.post("/analyze-flood/")  # Supports legacy/alternate paths
async def analyze_disaster(
    file: UploadFile = File(...),                    
    file_pre: UploadFile = File(None),              
    disaster_type: str = Form("flood")
):
    try:
        post_contents = await file.read()
        try:
            image_post = Image.open(io.BytesIO(post_contents)).convert("RGB")
        except UnidentifiedImageError as exc:
            raise HTTPException(status_code=400, detail="Post-disaster file is not a valid image") from exc
        
        image_pre = None
        disaster_lower = disaster_type.lower()
        
        if disaster_lower in {"earthquake", "wildfire"}:
            if not file_pre:
                raise HTTPException(
                    status_code=400, 
                    detail=f"A pre-disaster reference image is required for {disaster_type} change-detection analysis."
                )
            pre_contents = await file_pre.read()
            try:
                image_pre = Image.open(io.BytesIO(pre_contents)).convert("RGB")
            except UnidentifiedImageError as exc:
                raise HTTPException(status_code=400, detail="Pre-disaster file is not a valid image") from exc

        results = engine.predict(image_post=image_post, image_pre=image_pre, disaster_type=disaster_lower)
        return results

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)