import { NextResponse } from 'next/server';
import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk';

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: "文本不能为空" }, { status: 400 });
    }

    // 使用服务器端环境变量（不带NEXT_PUBLIC_前缀）
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION;
    
    if (!speechKey || !region) {
      return NextResponse.json({ error: "语音服务配置不完整" }, { status: 500 });
    }

    // 创建语音配置
    const speechConfig = speechSDK.SpeechConfig.fromSubscription(speechKey, region);
    speechConfig.speechSynthesisVoiceName = "zh-HK-HiuMaanNeural";
    speechConfig.speechSynthesisOutputFormat = speechSDK.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    // 使用SpeechSynthesizer，直接获取音频数据
    const synthesizer = new speechSDK.SpeechSynthesizer(speechConfig);
    
    // 返回一个Promise包装的合成结果
    const result = await new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        response => {
          synthesizer.close();
          if (response.reason === speechSDK.ResultReason.SynthesizingAudioCompleted) {
            resolve(response);
          } else {
            reject(new Error(`合成取消: ${response.errorDetails || "未知错误"}`));
          }
        },
        error => {
          synthesizer.close();
          reject(new Error(`合成错误: ${error}`));
        }
      );
    });
    
    // 检查audioData是否存在
    if (!result || !result.audioData || result.audioData.byteLength === 0) {
      return NextResponse.json({ error: "音频合成失败，没有返回数据" }, { status: 500 });
    }
    
    // 确保audioData存在后再进行处理
    const headers = {
      'Content-Type': 'audio/mpeg'
    };
    
    // 只有在确认audioData存在后才添加Content-Length
    if (result.audioData && result.audioData.byteLength) {
      headers['Content-Length'] = result.audioData.byteLength.toString();
    }
    
    // 返回音频数据作为二进制响应
    return new NextResponse(result.audioData, {
      status: 200,
      headers: headers
    });
  } catch (error) {
    console.error("TTS API错误:", error);
    return NextResponse.json({ error: error.message || "服务器错误" }, { status: 500 });
  }
}