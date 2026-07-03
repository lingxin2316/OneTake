# Android Studio 从零安装与运行指南

适用环境：Windows 10 / Windows 11  
项目目录：`D:\emmm\android-app`

---

## 1. 需要安装什么

最少需要：

- Android Studio
- JDK 17
- Android SDK / Build Tools / Platform Tools
- 模拟器，或一台已开启开发者选项的 Android 真机

通常不需要单独安装全局 Gradle。Android Studio 可以自己下载和管理 Gradle。

---

## 2. 安装 Android Studio

打开 PowerShell，运行：

```powershell
winget install -e --id Google.AndroidStudio
```

如果 `winget` 不可用，可以手动下载安装：

```text
https://developer.android.com/studio
```

安装完成后，常见安装位置是：

```text
C:\Program Files\Android\Android Studio\bin\studio64.exe
```

如果 `studio64` 命令不可用，这是正常的，说明它没有加入 PATH。

可以用完整路径打开：

```powershell
& "C:\Program Files\Android\Android Studio\bin\studio64.exe" "D:\emmm\android-app"
```

注意：路径前面的 `&` 不能省略，因为路径里有空格。

---

## 3. 安装 JDK 17

推荐安装 Temurin JDK 17：

```powershell
winget install -e --id EclipseAdoptium.Temurin.17.JDK
```

安装完成后，关闭当前 PowerShell，重新打开，再检查：

```powershell
java -version
```

如果 Android Studio 自己提示下载或配置 JDK，也可以直接使用 Android Studio 内置 JDK。

---

## 4. 打开项目

不要直接在 PowerShell 输入：

```powershell
D:\emmm\android-app
```

这是文件夹路径，不是命令。

进入目录用：

```powershell
cd D:\emmm\android-app
```

用资源管理器打开：

```powershell
explorer D:\emmm\android-app
```

用 Android Studio 打开：

```powershell
& "C:\Program Files\Android\Android Studio\bin\studio64.exe" "D:\emmm\android-app"
```

也可以从开始菜单打开 Android Studio，然后选择：

```text
Open > D:\emmm\android-app
```

---

## 5. 第一次 Gradle Sync

打开项目后，Android Studio 会自动同步 Gradle。

如果右上角出现：

```text
Sync Now
```

点击它。

如果提示缺少这些组件，直接点安装：

- Android SDK Platform
- Android SDK Build-Tools
- Android SDK Platform-Tools
- Android Emulator
- Gradle
- JDK

---

## 6. 创建模拟器

推荐先用模拟器跑起来，暂时不用折腾 USB 驱动。

在 Android Studio 中打开：

```text
Tools > Device Manager
```

如果找不到，也可以看右侧边栏的手机图标。

然后：

```text
Create device > Pixel 7 / Pixel 8 > 选择系统镜像 > Download > Finish
```

创建好后，在 Device Manager 里点击三角形启动模拟器。

模拟器启动后，顶部运行设备下拉框选择这个模拟器，再点绿色运行按钮。

---

## 7. 使用真机调试

如果要用 Android 真机，需要：

1. 手机和电脑用数据线连接，或使用 WiFi 调试；
2. 手机开启开发者选项；
3. 打开 USB 调试；
4. Windows 安装对应手机品牌的 USB 驱动。

开启开发者选项：

```text
设置 > 关于手机 > 连续点击“版本号”7 次
```

然后打开：

```text
设置 > 开发者选项 > USB 调试
```

连接电脑后，手机上出现授权弹窗时点：

```text
允许 USB 调试
```

常见品牌驱动：

| 品牌 | 驱动建议 |
|---|---|
| Google Pixel | Android Studio SDK Manager 安装 `Google USB Driver` |
| Samsung | Samsung USB Driver |
| 小米 / Redmi | Mi USB Driver 或小米助手 |
| 华为 / 荣耀 | HiSuite |
| OPPO / OnePlus / realme | 官方 USB Driver 或手机助手 |
| vivo / iQOO | vivo 手机助手或 USB Driver |

Pixel 驱动位置：

```text
Tools > SDK Manager > SDK Tools > Google USB Driver > Apply
```

---

## 8. WiFi 配对真机

手机和电脑需要连接同一个 WiFi。

手机上：

```text
开发者选项 > 无线调试 / Wireless debugging
```

打开后选择：

```text
使用配对码配对设备 / Pair device with pairing code
```

Android Studio 中：

```text
Device Manager > Pair Devices Using Wi-Fi
```

输入手机上显示的配对码。

如果 Android Studio 找不到手机，先用 USB 连接一次，授权成功后再切 WiFi。

---

## 9. 常见问题

### 9.1 `studio64` 不是命令

报错：

```text
studio64 : 无法将“studio64”项识别为 cmdlet
```

原因：Android Studio 没加入 PATH。

解决：

```powershell
& "C:\Program Files\Android\Android Studio\bin\studio64.exe" "D:\emmm\android-app"
```

---

### 9.2 `gradlew.bat` 不存在

报错：

```text
.\gradlew.bat : 无法将“.\gradlew.bat”项识别为 cmdlet
```

原因：项目目前还没有生成 Gradle Wrapper。

解决：先用 Android Studio 打开并完成 Gradle Sync。之后可以再生成 Wrapper。

当前阶段优先使用 Android Studio 的运行按钮，不强依赖命令行 Gradle。

---

### 9.3 找不到 Gradle 包

报错：

```text
winget install -e --id Gradle.Gradle
找不到与输入条件匹配的程序包。
```

解决：跳过全局 Gradle。Android Studio 会管理项目 Gradle。

---

### 9.4 Java heap space

报错：

```text
java.lang.OutOfMemoryError: Java heap space
```

项目已添加：

```properties
org.gradle.jvmargs=-Xmx4096m -Dfile.encoding=UTF-8 -XX:+UseParallelGC
kotlin.daemon.jvmargs=-Xmx2048m
```

如果仍然报错：

```text
File > Settings > Build, Execution, Deployment > Compiler
```

把：

```text
Shared build process heap size
```

改成：

```text
4096
```

然后重启 Android Studio。

电脑内存较小时，先关闭模拟器再 Sync。

---

### 9.5 JVM target 不一致

报错：

```text
Inconsistent JVM-target compatibility detected
compileDebugJavaWithJavac (1.8)
compileDebugKotlin (21)
```

项目已在 `android-app/app/build.gradle.kts` 中统一为 Java 17：

```kotlin
compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

kotlin {
    jvmToolchain(17)
}
```

修改后重新 Sync：

```text
File > Sync Project with Gradle Files
```

---

### 9.6 Kotlin daemon 异常退出

报错：

```text
The daemon has terminated unexpectedly
Kotlin compile daemon is ready
```

项目已添加：

```properties
kotlin.compiler.execution.strategy=in-process
```

建议操作：

1. 关闭 Android Studio；
2. 重新打开项目；
3. 再执行 Gradle Sync。

如果仍然卡住，可以先关闭 Android Studio，然后在 PowerShell 运行：

```powershell
taskkill /F /IM java.exe
```

注意：这会结束正在运行的 Java / Gradle 进程。

---

## 10. 推荐运行顺序

第一次从零开始，建议按这个顺序：

1. 安装 Android Studio；
2. 安装 JDK 17，或使用 Android Studio 内置 JDK；
3. 打开 `D:\emmm\android-app`；
4. 等待 Gradle Sync；
5. 安装 Android SDK / Build Tools；
6. 创建模拟器；
7. 运行 `app`；
8. 如果模拟器能正常运行，再考虑真机 USB 或 WiFi 调试。

---

## 11. 当前项目状态

当前 Android 工程是 Sprint 1 骨架：

- 首页分组列表；
- 卡片决策页；
- 设置页；
- 底部导航；
- 暂存栏；
- 精选集 BottomSheet；
- 删除轻提示；
- 撤回 toast；
- 假数据 UI。

下一阶段是 Sprint 2：

- 接入真实相册权限；
- 读取 MediaStore；
- 显示真实缩略图；
- 首页展示真实分类和数量。
