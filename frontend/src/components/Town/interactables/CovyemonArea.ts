import CoveymonAreaController from '../../../classes/CoveymonAreaController';
import TownController from '../../../classes/TownController';
import { BoundingBox } from '../../../types/CoveyTownSocket';
import Interactable, { KnownInteractableTypes } from '../Interactable';
import TownGameScene from '../TownGameScene';

export default class CoveymonArea extends Interactable {
  private _infoTextBox?: Phaser.GameObjects.Text;

  public _townController: TownController;

  private _coveymon?: CoveymonAreaController;

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
        this._coveymon = undefined;
        if (this._infoTextBox) {
          this._infoTextBox.text = '(No Coveymon)';
        }
      } else {
        this._coveymon = area;
      }
    }
  }

  private _showInfoBox() {
    if (!this._infoTextBox) {
      this._infoTextBox = this.scene.add
        .text(
          this.scene.scale.width / 2,
          this.scene.scale.height / 2,
          'Press SPACE to interact with the Coveymon area!',
          { color: '#000000', backgroundColor: '#FFFFFF' },
        )
        .setScrollFactor(0)
        .setDepth(30);
    }
    this._infoTextBox.setVisible(true);
    this._infoTextBox.x = this.scene.scale.width / 2 - this._infoTextBox.width / 2;
  }

  private _hideInfoBox() {
    this._infoTextBox?.setVisible(false);
  }

  overlap(): void {
    this._showInfoBox();
  }

  overlapExit(): void {
    this._hideInfoBox();
  }
}
