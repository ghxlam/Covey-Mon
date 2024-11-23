import CoveymonAreaController from '../../../classes/CoveymonAreaController';
import TownController from '../../../classes/TownController';
import { BoundingBox } from '../../../types/CoveyTownSocket';
import Interactable, { KnownInteractableTypes } from '../Interactable';
import TownGameScene from '../TownGameScene';

export default class CoveymonArea extends Interactable {
  private _infoTextBox?: Phaser.GameObjects.Text;

  private _labelText?: Phaser.GameObjects.Text;

  private _townController: TownController;

  private _coveymon?: CoveymonAreaController;

  private _isInteracting = false;

  constructor(scene: TownGameScene) {
    super(scene);
    this._townController = scene.coveyTownController;
    this.setTintFill();
    this.setAlpha(0.3);
    this._townController.addListener('coveymonChanged', this._updateCoveymonArea);
  }

  addedToScene(): void {
    super.addedToScene();
    this.scene.add.text(
      this.x - this.displayWidth / 2,
      this.y - this.displayHeight / 2,
      this.name,
      { color: '#FFFFFF', backgroundColor: '#000000' },
    );
    this._updateCoveymonArea(this._townController.coveymonAreas);
  }

  getType(): KnownInteractableTypes {
    return 'coveymonArea';
  }

  public getBoundingBox(): BoundingBox {
    const { x, y, width, height } = this.getBounds();
    return { x, y, width, height };
  }

  private _updateCoveymonArea(areas: CoveymonAreaController[]) {
    const area = areas.find(eachAreaInController => eachAreaInController.id === this.name);
    if (area !== this._coveymon) {
      if (area === undefined) {
        // If no matching area is found
        this._coveymon = undefined;
        if (this._infoTextBox) {
          this._infoTextBox.text = '(No Coveymon)';
        }
      } else {
        // If a matching area is found
        this._coveymon = area;

        // Create a button if the player is overlapping
        if (this.isOverlapping) {
          const button = this.scene.add
            .text(this.scene.scale.width / 2 - 50, this.scene.scale.height / 2 + 50, 'Click Me!', {
              color: '#FFFFFF',
              backgroundColor: '#0000FF',
              padding: { x: 10, y: 5 },
            })
            .setInteractive()
            .setScrollFactor(0)
            .setDepth(30);

          button.on('pointerdown', () => {
            // On button click, display "Coveymon!"
            if (this._infoTextBox) {
              this._infoTextBox.setText('Coveymon!');
              this._infoTextBox.setVisible(true);
            }
            // Destroy the button after clicking
            button.destroy();
          });
        }
      }
    }
  }

  private _showInfoBox() {
    if (!this._infoTextBox) {
      this._infoTextBox = this.scene.add
        .text(
          this.scene.scale.width / 2,
          this.scene.scale.height / 2,
          'Coveymon \nis undifened but why?\n',
          { color: '#000000', backgroundColor: '#FFFFFF' },
        )
        .setScrollFactor(0)
        .setDepth(30);
    }
    this._infoTextBox.setVisible(true);
    this._infoTextBox.x = this.scene.scale.width / 2 - this._infoTextBox.width / 2;
  }

  overlap(): void {
    if (this._coveymon === undefined) {
      this._showInfoBox();
    }
  }

  overlapExit(): void {
    this._infoTextBox?.setVisible(false);
  }
}
