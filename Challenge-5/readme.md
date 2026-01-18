# Challenge 5 - Proof of Parity

## Objective
- Analyze the provided file.(https://drive.google.com/drive/folders/1VPDCL_txR2q6U7ejr7W0GuFcmLxxuMXJ)
- Identify hidden patterns or encodings within the data.
- Extract the flag from the file.

## 🔍 Step 1: Initial File Inspection

The provided file is a PNG image.
At first glance, it appears to be a harmless aerial photograph of a campus located in a hilly, green region.

### Actions performed:

-Opened the image using a standard image viewer

-Checked for any immediately visible text, symbols, or distortions

### Observation:

-No visible text

-No QR codes

-No obvious steganographic artifacts

-Image appears clean and professionally captured

## 🧪 Step 2: Steganography & Forensic Checks (Ruling Out Hidden Data)

Even if the image looks normal, CTF methodology requires verifying whether hidden data exists.

### Techniques Considered

-Metadata inspection (EXIF)

-LSB steganography

-Bit-plane analysis

-Embedded files (ZIP/audio/etc.)

-Alpha channel manipulation

### Result:

-No hidden payload detected

-No suspicious compression artifacts

-No appended data after PNG IEND chunk

-No readable strings inside binary

### 📌 Conclusion:
This is not a steganography-based challenge.

## 🧠 Step 3: Common Sense
Since we have tried most of the techniques used for ananlysis of the image and found nothing it means that the answer is of something of common sense . Since , the given image is of IIT MANDI north campus , the most logical answers could be

# SAIC{IIT_MANDI}
# SAIC{NORTH_CAMPUS}

