// 保存RSVP信息
let rsvpInfo = null;

// 初始留言数据
let messages = [];

// 全局 URL 定义
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSdQEmZvHv5_ouQudugTyeDam_wlPQwxy_n0j76dEg6-9_uZlToAiWm-AZDrX1sQOtpA/exec';

// 添加显示骨架屏的函数
// 修改显示骨架屏的函数
function showSkeletonLoading() {
    const messagesContainer = document.getElementById('messages');
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = '';
    
    // 创建一个包含多个骨架卡片的容器
    const skeletonContainer = document.createElement('div');
    skeletonContainer.style.display = 'flex';
    skeletonContainer.style.gap = '20px';
    
    // 创建更多的骨架卡片来填满滚动区域
    for (let i = 0; i < 8; i++) { // 增加到 8 个或更多
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'skeleton-card';
        skeletonCard.innerHTML = `
            <div class="skeleton-header">
                <div class="skeleton-avatar message-skeleton"></div>
                <div class="skeleton-info">
                    <div class="skeleton-name message-skeleton"></div>
                    <div class="skeleton-relation message-skeleton"></div>
                </div>
            </div>
            <div class="skeleton-content message-skeleton"></div>
            <div class="skeleton-time message-skeleton"></div>
        `;
        skeletonContainer.appendChild(skeletonCard);
    }
    
    messagesContainer.appendChild(skeletonContainer);
}


// 修改 fetchMessages 函数 - 移除重复的 URL 定义
// 修改 fetchMessages 函数
async function fetchMessages() {
    // 显示骨架屏
    showSkeletonLoading();
    
    try {
        console.log('Fetching messages...');
        const response = await fetch(SCRIPT_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('Data received:', data);
        
        if (data.status === 'success' && Array.isArray(data.messages)) {
            messages = data.messages;
            console.log('Messages array:', messages);
            renderMessages();
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

// 在页面加载时就显示骨架屏
document.addEventListener('DOMContentLoaded', () => {
    showSkeletonLoading();
    fetchMessages();
});

// 统一的提交函数
async function submitToGoogleSheets(data) {
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

// 获取首字符作为头像
function getInitial(name) {
    return name.charAt(0);
}

// 渲染留言函数
// 修改渲染留言函数
function renderMessages() {
    const messagesContainer = document.getElementById('messages');
    if (!messagesContainer) {
        console.error('Messages container not found!');
        return;
    }
    
    console.log('Rendering messages:', messages);
    messagesContainer.innerHTML = '';
    
    if (!messages || messages.length === 0) {
        console.log('No messages to display');
        return;
    }
    
    // 增加复制次数，确保有足够的内容进行滚动
    // 在移动端需要更多的复制来保持连续滚动
    const isMobile = window.innerWidth <= 768;
    const repeatTimes = isMobile ? 8 : 3; // 移动端使用更多重复
    const allMessages = [];
    
    // 创建足够多的消息副本
    for (let i = 0; i < repeatTimes; i++) {
        allMessages.push(...messages);
    }
    
    const fragment = document.createDocumentFragment();
    
    allMessages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message-card';
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="avatar">${getInitial(msg.name)}</div>
                <div class="user-info">
                    <div class="message-name">${msg.name}</div>
                    <div class="message-relation">${msg.relation}</div>
                </div>
            </div>
            <div class="message-content">${msg.message}</div>
            <div class="message-time">${msg.time}</div>
        `;
        fragment.appendChild(messageElement);
    });
    
    messagesContainer.appendChild(fragment);

    // 动态调整动画持续时间
    const scrollContainer = messagesContainer.querySelector('.messages-scroll');
    if (scrollContainer) {
        const totalWidth = scrollContainer.scrollWidth;
        const duration = isMobile ? totalWidth / 50 : totalWidth / 100; // 移动端使用更慢的速度
        scrollContainer.style.animationDuration = `${duration}s`;
    }
}

// 为窗口大小变化添加适当的处理
window.addEventListener('resize', () => {
    requestAnimationFrame(renderMessages);
});

// 显示提示信息
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // 3秒后自动移除提示
    setTimeout(() => {
        notification.remove();
    }, duration);
}

// 处理RSVP选择
function handleRSVP(choice, event) {  // 添加 event 参数
    // 重置所有状态
    rsvpInfo = null; // 清空之前的信息
    
    // 获取实际点击的按钮元素
    const clickedButton = event.currentTarget;
    
    // 移除所有按钮的 selected 类
    document.querySelectorAll('.rsvp-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // 给点击的按钮添加 selected 类
    clickedButton.classList.add('selected');

    if (choice === 'yes') {
        document.getElementById('rsvp-form').style.display = 'block';
        document.getElementById('regret-message').style.display = 'none';
        document.getElementById('message-invite').style.display = 'none';
        document.getElementById('message-form').style.display = 'none';
    } else {
        document.getElementById('rsvp-form').style.display = 'none';
        document.getElementById('regret-message').style.display = 'block';
        document.getElementById('message-invite').style.display = 'none';
        document.getElementById('message-form').style.display = 'none';
    }
}





// 修改出席表单提交处理
// 修改出席表单提交处理
document.getElementById('attendance-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    showLoading();
    
    const attendanceData = {
        type: 'attendance',
        name: document.getElementById('rsvp-name').value,
        relation: document.getElementById('rsvp-relation').value,
        count: document.getElementById('rsvp-count').value,
        time: formatDate(new Date())
    };

    try {
        const success = await submitToGoogleSheets(attendanceData);
        if (success) {
            rsvpInfo = attendanceData;
            // 隐藏 RSVP 部分
            document.querySelector('.rsvp-section').style.display = 'none';
            document.getElementById('rsvp-form').style.display = 'none';
            // 显示留言邀请
            document.getElementById('message-invite').style.display = 'block';
            showNotification('Information submitted successfully!');
        } else {
            throw new Error('提交失败');
        }
    } catch (error) {
        showNotification('Submission failed, please try again');
    } finally {
        hideLoading();
    }
});







// 显示留言表单
function showMessageForm() {
    document.getElementById('message-form').style.display = 'block';
    document.getElementById('message-invite').style.display = 'none';
    document.getElementById('regret-message').style.display = 'none';

    // 只有在选择Yes并填写了RSVP信息的情况下才自动填充
    if (rsvpInfo) {
        document.getElementById('manual-info').style.display = 'none';
        document.getElementById('name').value = rsvpInfo.name;
        document.getElementById('relation').value = rsvpInfo.relation;
    } else {
        // 选择No的情况，显示手动输入区域，并清空之前可能填写的内容
        document.getElementById('manual-info').style.display = 'block';
        document.getElementById('name').value = '';
        document.getElementById('relation').value = '';
    }
}







// 定期刷新消息（每5分钟）
setInterval(fetchMessages, 5 * 60 * 1000);

// 添加窗口调整大小时重新渲染的功能
window.addEventListener('resize', renderMessages);

// 添加这个通用提交函数
async function submitToGoogleSheets(data) {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSdQEmZvHv5_ouQudugTyeDam_wlPQwxy_n0j76dEg6-9_uZlToAiWm-AZDrX1sQOtpA/exec'; // 替换为你的 Apps Script 网址
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

// 添加一个格式化时间的函数
function formatDate(date) {
    return new Date(date).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}



// 将 DOMContentLoaded 事件监听器移到文件末尾
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, fetching messages...');
    await fetchMessages();
    
    // 添加新的表单提交处理代码
    const guestbookForm = document.getElementById('guestbook-form');
    const oldListener = guestbookForm?.onsubmit;
    if (oldListener) {
        guestbookForm.removeEventListener('submit', oldListener);
    }

    // 添加新的监听器
    guestbookForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        showLoading();
        
        const messageData = {
            type: 'messages',
            name: document.getElementById('name').value,
            relation: document.getElementById('relation').value,
            message: document.getElementById('message').value,
            time: formatDate(new Date())
        };

        try {
            const success = await submitToGoogleSheets(messageData);
            if (success) {
                await fetchMessages();
                this.reset();
                document.getElementById('message-form').style.display = 'none';
                // 恢复 RSVP 部分的显示
                document.querySelector('.rsvp-section').style.display = 'block';
                // 重置 RSVP 按钮状态
                document.querySelectorAll('.rsvp-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                showNotification('Message sent successfully!');
            } else {
                throw new Error('提交失败');
            }
        } catch (error) {
            showNotification('Failed to submit message, please try again');
        } finally {
            hideLoading();
        }
    });
});

function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    loading.id = 'loadingOverlay';
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.remove();
    }
}

// collabsible //
document.addEventListener('DOMContentLoaded', function() {
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const currentlyActive = document.querySelector('.faq-question.active');
            
            // 如果点击的不是当前展开的项目
            if (!question.classList.contains('active')) {
                // 关闭当前展开的项目
                if (currentlyActive) {
                    currentlyActive.classList.remove('active');
                    currentlyActive.nextElementSibling.style.maxHeight = '0';
                }
                
                // 展开点击的项目
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                // 如果点击的是当前展开的项目，则关闭它
                question.classList.remove('active');
                answer.style.maxHeight = '0';
            }
        });
    });
});


// Set the date we're counting down to
var countDownDate = new Date("Mar 15, 2025 18:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
  }
}, 1000);