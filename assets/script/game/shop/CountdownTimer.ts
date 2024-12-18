import { _decorator, Component, Label } from 'cc';
import { StringUtil } from '../common/utils/StringUtil';
const { ccclass, property } = _decorator;

@ccclass('CountdownTimer')
export class CountdownTimer extends Component {
    @property(Label) timerLabel: Label = null!;  // 倒计时显示标签 00:00:00
    private duration: number = 0;   // 倒计时持续时间（秒）
    private intervalId: NodeJS.Timeout | null = null;

    /**
    * 当组件被禁用时清除定时器
    */
    onDisable() {
        this.clearInterval();
    }

    /**
     * 设置倒计时持续时间
     * @param duration 持续时间（秒）
     */
    public setDuration(duration: number) {
        this.duration = duration;
        this.updateLabel();
        this.startCountdown();
    }

    /**
     * 启动倒计时
     */
    public startCountdown() {
        this.clearInterval();
        this.intervalId = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    /**
     * 停止倒计时
     */
    public stopCountdown() {
        this.clearInterval();
    }

    /**
     * 清除定时器
     */
    private clearInterval() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * 更新倒计时
     */
    private updateTimer() {
        if (this.duration > 0) {
            this.duration--;
            this.updateLabel();
        } else {
            this.stopCountdown();
        }
    }

    /**
     * 更新显示标签
     */
    private updateLabel() {
        this.timerLabel.string = StringUtil.formatExpireTime(this.duration);
    }
}