'use client'

import { ArrowRight, Camera, Lock } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { BaseModal } from '@/components/modals/BaseModal'
import { useModal } from '@/lib/modals/hooks/useModal'
import type { ModalParams } from '@/lib/modals/types'
import { checkUsernameAvailability } from '@/lib/api/services/username'
import { LoaderHeader } from '../../../ui/loaders/TerminalLoader/components/header/LoaderHeader'
import Steps from '../components/Steps'
import { Button } from '@/components/ui/Button'

const BG_COLOR = 'bg-bg-3/25'
const MIN_HANDLE_LENGTH = 3
const MAX_HANDLE_LENGTH = 24

type AvailabilityState = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

type IdentityStepsProps = ModalParams & {
    userName?: string | null
}

export function IdentitySteps({ userName = null }: IdentityStepsProps) {
    const { closeModal } = useModal()

    const normalizedUserName = userName?.trim().split(/\s+/)[0].toLowerCase() ?? ''
    const suggestedHandle = normalizedUserName
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, MAX_HANDLE_LENGTH)
    const [handle, setHandle] = useState('')
    const [availabilityState, setAvailabilityState] = useState<AvailabilityState>('idle')
    const [availabilityMessage, setAvailabilityMessage] = useState('')
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const previewUrlRef = useRef<string | null>(null)
    const availabilityRequestIdRef = useRef(0)

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current)
            }
        }
    }, [])

    const sanitizeHandle = (value: string) =>
        value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, MAX_HANDLE_LENGTH)

    const runAvailabilityCheck = async (value: string) => {
        const cleaned = sanitizeHandle(value).trim()

        if (!cleaned) {
            setAvailabilityState('idle')
            setAvailabilityMessage('')
            return
        }

        if (cleaned.length < MIN_HANDLE_LENGTH) {
            setAvailabilityState('invalid')
            setAvailabilityMessage(`Username must be at least ${MIN_HANDLE_LENGTH} characters.`)
            return
        }

        if (cleaned.length > MAX_HANDLE_LENGTH) {
            setAvailabilityState('invalid')
            setAvailabilityMessage(`Username must be at most ${MAX_HANDLE_LENGTH} characters.`)
            return
        }

        const requestId = availabilityRequestIdRef.current + 1
        availabilityRequestIdRef.current = requestId
        setAvailabilityState('checking')
        setAvailabilityMessage('Checking availability...')

        try {
            const isAvailable = await checkUsernameAvailability(cleaned)
            if (availabilityRequestIdRef.current !== requestId) return

            setAvailabilityState(isAvailable ? 'available' : 'taken')
            setAvailabilityMessage(
                isAvailable ? 'Username is available.' : 'This username is not available.'
            )
        } catch {
            if (availabilityRequestIdRef.current !== requestId) return
            setAvailabilityState('taken')
            setAvailabilityMessage('Could not verify availability. Please try again.')
        }
    }

    const handleAvatarSelect = () => {
        fileInputRef.current?.click()
    }

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !file.type.startsWith('image/')) return

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current)
        }

        const previewUrl = URL.createObjectURL(file)
        previewUrlRef.current = previewUrl
        setAvatarPreview(previewUrl)
    }

    return (
        <BaseModal onClose={closeModal} variant="modal" showClose={false} className="w-full sm:max-w-sm! rounded-none!">
            <div className="-m-4 overflow-hidden border border-line-c bg-bg-3/5">
                <div className="pointer-events-none h-[0.5px] w-full bg-linear-to-r from-transparent via-g-3/85 to-transparent" />

                {/* Header bar */}
                <LoaderHeader title="Dgpredict" subtitle="auth" rightSubtitle="v5" />

                {/* Body */}
                <div className="px-6 pb-6 pt-4 bg-bg-3/10">
                    <Steps step={2} />

                    <div className="mb-8">
                        <h2 className="text-[19px] font-extrabold text-t-1 uppercase tracking-tighter font-ibm-plex">
                            Set identity
                        </h2>
                        <p className="text-[12px] tracking-tight text-t-3 font-jetbrains">
                            Your public handle on DGPredict.
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <div className="mb-6 text-center">
                            <button
                                type="button"
                                onClick={handleAvatarSelect}
                                className="group relative mx-auto flex h-14 w-14 items-center justify-center overflow-hidden border border-line-c bg-bg-3/20 text-[14px] font-bold uppercase text-t-3/80"
                            >
                                {avatarPreview ? (
                                    <Image
                                        src={avatarPreview}
                                        alt="Profile avatar preview"
                                        fill
                                        unoptimized
                                        sizes="56px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <span>{normalizedUserName?.trim().slice(0, 2) || 'DG'}</span>
                                )}
                                <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Camera size={16} className="text-t-1" />
                                </span>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                            <p className="mt-2 text-[12px] tracking-tightest text-t-3 font-jetbrains">
                                tap to set avatar
                            </p>
                        </div>

                        <label className="mb-2 block text-[10px] tracking-[0.18em] text-t-3 font-jetbrains">
                            HANDLE
                        </label>
                        <input
                            value={handle}
                            onChange={(e) => {
                                const next = sanitizeHandle(e.target.value)
                                setHandle(next)
                                if (availabilityState !== 'idle') {
                                    setAvailabilityState('idle')
                                    setAvailabilityMessage('')
                                }
                            }}
                            onBlur={(e) => runAvailabilityCheck(e.target.value)}
                            placeholder="your_handle"
                            className="h-10 w-full border border-line-c bg-bg-3/20 px-4 text-[13px] text-t-2 outline-none placeholder:text-t-3/70 focus:border-g-3/60 font-jetbrains"
                        />

                        <p className="mt-1 text-xs tracking-tightest text-t-3/80 font-jetbrains">
                            {handle.trim()
                                ? `dgpredict.com/u/${handle.trim()}`
                                : 'type a handle to see your URL'}
                        </p>

                        {suggestedHandle ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setHandle(suggestedHandle)
                                    setAvailabilityState('available')
                                    setAvailabilityMessage('Suggestion selected. Username is available.')
                                }}
                                className={`mt-2 inline-flex h-4 w-fit items-center border px-2 py-0 text-[10px] lowercase tracking-tightest font-jetbrains ${handle === suggestedHandle
                                    ? 'border-line-g bg-g-3/20 text-g-3'
                                    : 'border-line-c bg-bg-3/15 text-t-3 hover:border-line-g/60 hover:text-g-3/80'
                                    }`}
                            >
                                {suggestedHandle}
                            </button>
                        ) : null}

                        {availabilityState !== 'idle' ? (
                            <p
                                className={`mt-1 text-xs font-jetbrains ${availabilityState === 'available'
                                    ? 'text-g-3'
                                    : availabilityState === 'checking'
                                        ? 'text-t-3/80'
                                        : 'text-neg'
                                    }`}
                            >
                                {availabilityMessage}
                            </p>
                        ) : null}


                        <div className="flex flex-col gap-1 mt-4">

                            <Button
                                variant="accent"
                                className="text-[12px]"
                            >
                                CONFIRM IDENTITY <ArrowRight size={12} />
                            </Button>

                            <Button
                                variant="muted"
                                className="text-[12px]"
                            >
                                skip for now
                            </Button>
                        </div>
                    </div>

                </div>

                {/* Footer bar */}
                <div className={`flex items-center justify-between border-t border-line-c/70 px-3.5 py-1.5 text-[10px] tracking-[0.16em] text-t-3/80 font-jetbrains ${BG_COLOR}`}>
                    <span>TERMS & PRIVACY</span>
                    <span className="flex items-center gap-1">
                        <Lock size={10} className="text-t-3/70" />
                        PRIVY
                    </span>
                </div>
            </div>
        </BaseModal>
    )
}