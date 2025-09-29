'use client'

import { useState } from 'react'

interface TimeRestrictionSettingsProps {
  restaurantId: string
}

export default function TimeRestrictionSettings({ restaurantId }: TimeRestrictionSettingsProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('22:00')
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]) // 월-금 기본 선택
  const [customMessage, setCustomMessage] = useState('🕐 현재는 운영시간이 아닙니다.\n\n📍 영업시간: 오전 9시 ~ 오후 10시 (월~금)\n\n💫 영업시간 내에 다시 방문해 주세요!\n감사합니다. 😊')

  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  
  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    )
  }

  const formatTimeForDisplay = (time: string) => {
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? '오후' : '오전'
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum
    return `${ampm} ${displayHour}시${minute !== '00' ? ` ${parseInt(minute)}분` : ''}`
  }

  const getSelectedDaysText = () => {
    if (selectedDays.length === 0) return '없음'
    if (selectedDays.length === 7) return '매일'
    
    // 연속된 요일 그룹화
    const sortedDays = [...selectedDays].sort((a, b) => a - b)
    const groups: number[][] = []
    let currentGroup = [sortedDays[0]]
    
    for (let i = 1; i < sortedDays.length; i++) {
      if (sortedDays[i] === sortedDays[i-1] + 1) {
        currentGroup.push(sortedDays[i])
      } else {
        groups.push(currentGroup)
        currentGroup = [sortedDays[i]]
      }
    }
    groups.push(currentGroup)
    
    return groups.map(group => {
      if (group.length === 1) {
        return dayNames[group[0]]
      } else if (group.length === 2) {
        return `${dayNames[group[0]]}, ${dayNames[group[1]]}`
      } else {
        return `${dayNames[group[0]]}~${dayNames[group[group.length - 1]]}`
      }
    }).join(', ')
  }

  // 동적으로 메시지 생성
  const generateDynamicMessage = () => {
    if (customMessage.trim()) {
      return customMessage
    }
    
    const startDisplay = formatTimeForDisplay(startTime)
    const endDisplay = formatTimeForDisplay(endTime)
    const daysDisplay = getSelectedDaysText()
    
    return `🕐 현재는 운영시간이 아닙니다.\n\n📍 영업시간: ${startDisplay} ~ ${endDisplay} (${daysDisplay})\n\n💫 영업시간 내에 다시 방문해 주세요!\n감사합니다. 😊`
  }

  const handleSave = async () => {
    // TODO: API 호출로 설정 저장
    console.log('저장할 설정:', {
      isEnabled,
      startTime,
      endTime,
      selectedDays,
      customMessage: generateDynamicMessage()
    })
    alert('시간 제한 설정이 저장되었습니다!')
  }

  return (
    <div className='bg-purple-50 border border-purple-200 rounded-lg p-4'>
      <div className='text-center mb-4'>
        <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2'>
          <span className='text-purple-600 text-xl'>🕐</span>
        </div>
        <h3 className='text-lg font-medium text-purple-900'>시간대 제한</h3>
      </div>
      
      <div className='space-y-4'>
        <div className='text-center'>
          <div className='font-medium text-gray-900 mb-2'>운영 시간 제한</div>
          <div className='text-sm text-gray-600 mb-3'>특정 시간대에만 QR 코드 접근을 허용합니다</div>
        </div>
        
        {/* 활성화 토글 */}
        <div className='flex items-center justify-center space-x-3 mb-4'>
          <span className='text-sm text-gray-600'>비활성화</span>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input 
              type='checkbox' 
              className='sr-only peer' 
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
            />
            <div className='w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600'></div>
          </label>
          <span className='text-sm text-gray-600'>활성화</span>
        </div>

        {/* 시간 설정 */}
        <div className='space-y-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>시작 시간</label>
            <input 
              type='time' 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>종료 시간</label>
            <input 
              type='time' 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
            />
          </div>
        </div>

        {/* 요일 선택 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>운영 요일</label>
          <div className='grid grid-cols-7 gap-1'>
            {dayNames.map((day, index) => (
              <label key={day} className='flex flex-col items-center cursor-pointer'>
                <input 
                  type='checkbox' 
                  checked={selectedDays.includes(index)}
                  onChange={() => toggleDay(index)}
                  className='sr-only peer'
                />
                <div className='w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center text-xs font-medium peer-checked:bg-purple-600 peer-checked:border-purple-600 peer-checked:text-white hover:border-purple-400 transition-colors'>
                  {day}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 고객 안내 메시지 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>운영시간 외 안내 메시지</label>
          <textarea 
            placeholder='비워두면 설정값에 따라 자동으로 메시지가 생성됩니다'
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={4}
            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none'
          />
          <div className='mt-1 text-xs text-gray-500'>
            고객이 운영시간 외에 QR 코드로 접속했을 때 표시될 메시지입니다. 비워두면 설정값에 따라 자동 생성됩니다.
          </div>
        </div>

        {/* 미리보기 */}
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
          <div className='text-sm font-medium text-gray-700 mb-2 flex items-center'>
            <span className='mr-2'>👁️</span>
            고객 화면 미리보기
          </div>
          <div className='bg-white border border-gray-300 rounded-md p-4 text-center'>
            <div className='text-4xl mb-3'>🕐</div>
            <div className='text-lg font-semibold text-gray-900 mb-2'>운영시간이 아닙니다</div>
            <div className='text-sm text-gray-600 whitespace-pre-line'>
              {generateDynamicMessage().split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        </div>

        {/* 설정 요약 */}
        <div className='bg-white border border-purple-200 rounded-lg p-3'>
          <div className='text-sm font-medium text-purple-900 mb-2'>현재 설정 요약</div>
          <div className='text-xs text-gray-600 space-y-1'>
            <div>• 시간 제한: {isEnabled ? '활성화' : '비활성화'}</div>
            <div>• 운영시간: {formatTimeForDisplay(startTime)} ~ {formatTimeForDisplay(endTime)}</div>
            <div>• 운영요일: {getSelectedDaysText()}</div>
          </div>
        </div>

        {/* 적용 버튼 */}
        <button 
          onClick={handleSave}
          className='bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium w-full'
        >
          시간 제한 적용
        </button>
      </div>
    </div>
  )
}