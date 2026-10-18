# BTW-Bedrock Edition Prototype

This repository contains the improved prototype of the BTW-Bedrock Edition add-on for Minecraft Bedrock.

Contents:
- behavior_pack: block/item definitions, scripts, and recipes
- resource_pack: placeholder textures and texture atlas definitions

What is included:
- cement and wet cement behavior
- windmill and grinder block definitions
- copper ore and copper ingot recipes
- starting-age scoreboard logic
- saturation effect logic for the prototype

How to turn the repo into .mcpack files for iPhone:

1. On a Mac or Windows computer, open the repo folder.
2. Zip the contents of the behavior_pack folder (not the folder itself).
3. Rename the file from .zip to .mcpack.
   Example name: BTW_Bedrock_Behavior.mcpack
4. Zip the contents of the resource_pack folder (not the folder itself).
5. Rename the file from .zip to .mcpack.
   Example name: BTW_Bedrock_Resource.mcpack

macOS via Terminal:

cd behavior_pack
zip -r ../BTW_Bedrock_Behavior.zip *
cd ..
mv BTW_Bedrock_Behavior.zip BTW_Bedrock_Behavior.mcpack

cd resource_pack
zip -r ../BTW_Bedrock_Resource.zip *
cd ..
mv BTW_Bedrock_Resource.zip BTW_Bedrock_Resource.mcpack

Windows via PowerShell:

Compress-Archive -Path .\behavior_pack\* -DestinationPath .\BTW_Bedrock_Behavior.zip
Rename-Item .\BTW_Bedrock_Behavior.zip .\BTW_Bedrock_Behavior.mcpack

Compress-Archive -Path .\resource_pack\* -DestinationPath .\BTW_Bedrock_Resource.zip
Rename-Item .\BTW_Bedrock_Resource.zip .\BTW_Bedrock_Resource.mcpack

How to install on iPhone:
1. AirDrop the two .mcpack files to your iPhone or transfer them via Files / iCloud.
2. Tap the .mcpack file and choose Open in Minecraft.
3. In Minecraft create a new world (or edit an existing one).
4. Enable Experimental Gameplay.
5. Attach both packs under Add-Ons.
6. Start the world and test with:
   - /give @s btw:cement_item 1

Notes:
- These are placeholder textures for a prototype.
- Scripted behavior requires Experimental Gameplay enabled.
- The repo is ready for further iteration and customization.
