import { SpriteFrame, SpriteAtlas } from "cc";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";

/** 图集处理 */
export class AtlasUtil {
    /** 加载图集(精灵图) */
    static async loadAtlasAsync(atlasPath: string): Promise<SpriteFrame | null> {
        return new Promise((resolve, reject) => {
            const paths = atlasPath.split('|');
            if (paths.length == 1) {
                oops.res.loadAsync(atlasPath + '/spriteFrame', SpriteFrame).then((spriteFrame: SpriteFrame) => {
                    resolve(spriteFrame);
                });
            }
            if (paths.length == 2) {
                oops.res.loadAsync(paths[0], SpriteAtlas).then((atlas: SpriteAtlas) => {
                    let spriteFrame = atlas.getSpriteFrame(paths[1]);
                    resolve(spriteFrame);
                });
            }
        });
    }
}