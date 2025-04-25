'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { cn } from '../lib/utils';
import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk';

const CantoneseTTS = forwardRef(({ text, className, iconSize = 32 }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    
    // 使用 Azure 语音服务进行文本转语音
    const speakCantonese = (textToSpeak = text) => {
        if (isPlaying) return;
        
        try {
            setIsPlaying(true);
            
            // 创建语音配置
            const speechConfig = speechSDK.SpeechConfig.fromSubscription(
                process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY, 
                process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION
            );
            // 直接在组件中设置语音模型
            speechConfig.speechSynthesisVoiceName = "zh-HK-HiuMaanNeural";
            
            // 创建语音合成器
            const synthesizer = new speechSDK.SpeechSynthesizer(speechConfig);
            
            // 开始合成并播放
            synthesizer.speakTextAsync(
                textToSpeak,
                result => {
                    // 合成完成的回调
                    if (result.reason === speechSDK.ResultReason.SynthesizingAudioCompleted) {
                        console.log("Azure TTS synthesis completed");
                    } else {
                        console.error("Azure TTS synthesis canceled, " + result.errorDetails);
                    }
                    synthesizer.close();
                    setIsPlaying(false);
                },
                error => {
                    // 发生错误的回调
                    console.error("Azure TTS error: " + error);
                    synthesizer.close();
                    setIsPlaying(false);
                }
            );
        } catch (error) {
            console.error("Azure TTS setup error:", error);
            setIsPlaying(false);
        }
    };

    // 向父组件暴露 speak 方法
    useImperativeHandle(ref, () => ({
        speak: speakCantonese,
    }));

    return (
        <div className={cn('flex justify-center items-center', className)}>
            <Image
                src='/images/sound.png'
                alt='Play Cantonese'
                width={iconSize}
                height={iconSize}
                onClick={() => speakCantonese()}
                style={{ 
                    cursor: isPlaying ? 'default' : 'pointer',
                    opacity: isPlaying ? 0.6 : 1 
                }}
            />
        </div>
    );
});

CantoneseTTS.displayName = 'CantoneseTTS';

export default CantoneseTTS;