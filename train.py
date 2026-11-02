import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
import segmentation_models_pytorch as smp
import numpy as np

# 1. Dummy Dataset class for quick setup (Replace with your actual image/mask loader if you have dataset folders)
class DummyDisasterDataset(Dataset):
    def __init__(self, num_samples=50):
        self.num_samples = num_samples
    
    def __len__(self):
        return self.num_samples
    
    def __getitem__(self, idx):
        # Generates random 3-channel image tensor (Batch, Channels, Height, Width)
        image = torch.randn(3, 256, 256)
        # Generates multi-class mask tensor (0: Background, 1: Flood, 2: Wildfire/Damage)
        mask = torch.randint(0, 3, (256, 256), dtype=torch.long)
        return image, mask

def train_model():
    print("Initializing Multi-Disaster U-Net Model...")
    
    # 3 classes: 0=Background, 1=Flood, 2=Wildfire/Structural Damage
    model = smp.Unet(
        encoder_name="resnet34", 
        encoder_weights="imagenet", 
        in_channels=3, 
        classes=3
    )
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    dataset = DummyDisasterDataset(num_samples=20)
    dataloader = DataLoader(dataset, batch_size=4, shuffle=True)
    
    model.train()
    print("Starting rapid training loop for submission...")
    
    for epoch in range(3):  # Run a quick 3-epoch training session
        epoch_loss = 0
        for images, masks in dataloader:
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, masks)
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()
            
        print(f"Epoch {epoch+1}/3 completed | Loss: {epoch_loss / len(dataloader):.4f}")
        
    # Save your custom trained model weights
    torch.save(model.state_dict(), "multi_disaster_model.pth")
    print("Training complete! Model saved as 'multi_disaster_model.pth'.")

if __name__ == "__main__":
    train_model()