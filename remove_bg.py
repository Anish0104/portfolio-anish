import os
import sys

try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("Please ensure rembg and Pillow are installed (pip install rembg pillow)")
    sys.exit(1)

input_path = "public/avatar-raw.png"
output_path = "public/avatar-v9.png"

if not os.path.exists(input_path):
    print(f"Error: Could not find {input_path}")
    sys.exit(1)

print(f"Processing {input_path} to remove background using high-precision alpha matting...")
try:
    input_image = Image.open(input_path)
    
    # Use alpha matting to cleanly segment hair edges and prevent halos
    output_image = remove(
        input_image,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=10
    )
    
    output_image.save(output_path, "PNG")
    print(f"✅ Successfully saved transparent image to {output_path}")
except Exception as e:
    print(f"❌ Error during processing: {e}")
    sys.exit(1)
