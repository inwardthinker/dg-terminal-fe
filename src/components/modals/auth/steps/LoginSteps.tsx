'use client'

import { ArrowRight, Lock, Wallet } from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BaseModal } from '@/components/modals/BaseModal'
import { useModal } from '@/lib/modals/hooks/useModal'
import { useLoginWithOAuth, usePrivy, type User } from '@privy-io/react-auth'

import Image from 'next/image'
import { LoaderHeader } from '../../../ui/loaders/TerminalLoader/components/header/LoaderHeader'
import Steps from '../components/Steps'
import { IdentitySteps } from './IdentitySteps'
import { Calibrate } from './CalibrateStep'
import { LOGIN_OPTIONS_CONFIG } from '../config'
import {
  OAUTH_INIT_STEPS,
  OAUTH_RETURN_STEPS,
} from '@/components/ui/loaders/TerminalLoader/constants'
import TerminalLoader from '@/components/ui/loaders/TerminalLoader/TerminalLoader'

type LoginOption = {
  key: string
  label: string
  onClick: () => void
  iconPath?: string
  iconBg: string
  isWallet?: boolean
}
type OAuthProvider = 'google' | 'twitter' | 'discord'
type AuthStep = 'auth' | 'identity' | 'calibrate' | 'done'

const BG_COLOR = 'bg-bg-3/25'
const AUTH_TITLE_ID = 'login-modal-title'
const AUTH_DESC_ID = 'login-modal-description'
const AUTH_PROVIDER_STORAGE_KEY = 'auth_provider'
const AUTH_MODAL_OPEN_STORAGE_KEY = 'auth_modal_open'
const AUTH_STEP_QUERY_KEY = 'step'
const RESTORE_CANCEL_TIMEOUT_MS = 2500
const IDENTITY_TO_CALIBRATE_STEPS = [
  { text: 'Syncing identity profile...', duration: 220 },
  { text: 'Bootstrapping signal engine...', duration: 260 },
  { text: 'Loading calibrator...', duration: 220 },
]

const normalizeAuthStep = (value: string | null): AuthStep =>
  value === 'identity' || value === 'calibrate' || value === 'done' ? value : 'auth'

const extractUserName = (
  oauthUser: User,
  loginMethod?: string | null,
  fallbackUser?: User | null,
) => {
  if (!oauthUser) return null

  const providerMap = {
    google_oauth: oauthUser.google?.name,
    twitter_oauth: oauthUser.twitter?.username,
    discord_oauth: oauthUser.discord?.username,
  }

  return (
    (loginMethod && providerMap[loginMethod as keyof typeof providerMap]) ??
    oauthUser.google?.name ??
    oauthUser.twitter?.username ??
    oauthUser.discord?.username ??
    fallbackUser?.google?.name ??
    fallbackUser?.twitter?.username ??
    fallbackUser?.discord?.username ??
    null
  )
}

export function LoginModal() {
  const { closeModal } = useModal()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { login, ready, user } = usePrivy()

  const [activeStep, setActiveStep] = useState<AuthStep>(() =>
    normalizeAuthStep(
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('step')
        : null,
    ),
  )
  const [providerUserName, setProviderUserName] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)
  const [isTransitioningToCalibrate, setIsTransitioningToCalibrate] = useState(false)

  const [restoredProvider, setRestoredProvider] = useState<OAuthProvider | null>(null)
  const [failedProvider, setFailedProvider] = useState<OAuthProvider | null>(null)
  const lastOAuthAttemptRef = useRef<OAuthProvider | null>(null)
  const shouldGoToIdentityRef = useRef(false)
  const stepFromQuery = normalizeAuthStep(searchParams.get(AUTH_STEP_QUERY_KEY))

  const setModalStep = (step: AuthStep) => {
    setActiveStep(step)
    const next = new URLSearchParams(searchParams.toString())
    next.set('modal', 'login')
    next.set(AUTH_STEP_QUERY_KEY, step)
    router.replace(`${pathname}?${next.toString()}`)
  }

  useEffect(() => {
    if (activeStep !== stepFromQuery) {
      setActiveStep(stepFromQuery)
    }
  }, [stepFromQuery, activeStep])

  useEffect(() => {
    if (!searchParams.get(AUTH_STEP_QUERY_KEY)) {
      const next = new URLSearchParams(searchParams.toString())
      next.set('modal', 'login')
      next.set(AUTH_STEP_QUERY_KEY, activeStep)
      router.replace(`${pathname}?${next.toString()}`)
    }
  }, [searchParams, activeStep, router, pathname])

  useEffect(() => {
    const storedProvider = sessionStorage.getItem(AUTH_PROVIDER_STORAGE_KEY)
    if (
      storedProvider === 'google' ||
      storedProvider === 'twitter' ||
      storedProvider === 'discord'
    ) {
      lastOAuthAttemptRef.current = storedProvider
      setLoadingProvider(storedProvider)
      setRestoredProvider(storedProvider)
      sessionStorage.removeItem(AUTH_PROVIDER_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (!restoredProvider || !loadingProvider || activeStep === 'identity') return

    const timeout = window.setTimeout(() => {
      const attempted = lastOAuthAttemptRef.current
      if (attempted) setFailedProvider(attempted)
      setLoadingProvider(null)
      setRestoredProvider(null)
      sessionStorage.removeItem(AUTH_PROVIDER_STORAGE_KEY)
      sessionStorage.removeItem(AUTH_MODAL_OPEN_STORAGE_KEY)
      setAuthError('Could not complete sign-in.')
    }, RESTORE_CANCEL_TIMEOUT_MS)

    return () => window.clearTimeout(timeout)
  }, [restoredProvider, loadingProvider, activeStep])

  const { initOAuth } = useLoginWithOAuth({
    onComplete: ({ user: callbackUser, loginMethod }) => {
      const extractedName = extractUserName(callbackUser, loginMethod, user)

      sessionStorage.removeItem(AUTH_PROVIDER_STORAGE_KEY)
      sessionStorage.removeItem(AUTH_MODAL_OPEN_STORAGE_KEY)

      lastOAuthAttemptRef.current = null
      setFailedProvider(null)
      setProviderUserName(extractedName)

      if (restoredProvider) {
        shouldGoToIdentityRef.current = true
      } else {
        setModalStep('identity')
      }

      setRestoredProvider(null)
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error && err.message ? err.message : 'Login failed. Please try again.'
      sessionStorage.removeItem(AUTH_PROVIDER_STORAGE_KEY)
      sessionStorage.removeItem(AUTH_MODAL_OPEN_STORAGE_KEY)
      const attempted = lastOAuthAttemptRef.current
      if (attempted) setFailedProvider(attempted)
      setLoadingProvider(null)
      setRestoredProvider(null)
      setAuthError(message)
    },
  })

  const handleOAuth = async (provider: OAuthProvider) => {
    try {
      setAuthError(null)
      if (provider !== failedProvider) {
        setFailedProvider(null)
      }
      lastOAuthAttemptRef.current = provider
      setLoadingProvider(provider)
      sessionStorage.setItem(AUTH_PROVIDER_STORAGE_KEY, provider)
      sessionStorage.setItem(AUTH_MODAL_OPEN_STORAGE_KEY, 'true')
      await initOAuth({ provider })
    } catch (e: unknown) {
      const message =
        e instanceof Error && e.message ? e.message : 'Login failed. Please try again.'
      sessionStorage.removeItem(AUTH_PROVIDER_STORAGE_KEY)
      sessionStorage.removeItem(AUTH_MODAL_OPEN_STORAGE_KEY)
      const attempted = lastOAuthAttemptRef.current
      if (attempted) setFailedProvider(attempted)
      setAuthError(message)
      setLoadingProvider(null)
      setRestoredProvider(null)
    }
  }

  const handleRetryOAuth = () => {
    if (!failedProvider) return
    void handleOAuth(failedProvider)
  }

  const handleSkipToCalibrate = () => {
    setIsTransitioningToCalibrate(true)
  }

  const options = LOGIN_OPTIONS_CONFIG.map((opt) => ({
    ...opt,
    onClick:
      opt.key === 'google'
        ? () => handleOAuth('google')
        : opt.key === 'twitter'
          ? () => handleOAuth('twitter')
          : opt.key === 'discord'
            ? () => handleOAuth('discord')
            : () => {
                setFailedProvider(null)
                login()
              },
  }))

  if (!ready) {
    return null
  }

  if (isTransitioningToCalibrate) {
    return (
      <BaseModal
        onClose={closeModal}
        variant="modal"
        showClose={false}
        contentClassName="p-0"
        className="rounded-none! md:w-[620px]! md:max-w-[700px]!"
      >
        <TerminalLoader
          steps={IDENTITY_TO_CALIBRATE_STEPS}
          onComplete={() => {
            setIsTransitioningToCalibrate(false)
            setModalStep('calibrate')
          }}
        />
      </BaseModal>
    )
  }

  if (activeStep === 'identity') {
    return <IdentitySteps userName={providerUserName} onSkipToCalibrate={handleSkipToCalibrate} />
  }

  if (activeStep === 'calibrate') {
    return <Calibrate />
  }

  if (loadingProvider) {
    const isRestored = restoredProvider !== null

    return (
      <BaseModal
        onClose={closeModal}
        variant="modal"
        showClose={false}
        contentClassName="p-0"
        className="rounded-none! md:w-[620px]! md:max-w-[700px]!"
      >
        <TerminalLoader
          steps={isRestored ? OAUTH_RETURN_STEPS : OAUTH_INIT_STEPS}
          onComplete={() => {
            if (shouldGoToIdentityRef.current) {
              setModalStep('identity')
              shouldGoToIdentityRef.current = false
            } else {
              setLoadingProvider(null)
            }
          }}
        />
      </BaseModal>
    )
  }

  return (
    <BaseModal
      onClose={closeModal}
      variant="modal"
      showClose={false}
      className="w-full sm:max-w-sm! rounded-none!"
    >
      <div className="-m-4 overflow-hidden border border-line-c bg-bg-3/5">
        <div className="pointer-events-none h-[0.5px] w-full bg-linear-to-r from-transparent via-g-3/85 to-transparent" />

        {/* Header bar */}
        <LoaderHeader title="Dgpredict" subtitle="auth" rightSubtitle="v5" />

        {/* Body */}
        <div
          className="px-6 pb-6 pt-4 bg-bg-3/10"
          role="region"
          aria-labelledby={AUTH_TITLE_ID}
          aria-describedby={AUTH_DESC_ID}
        >
          <Steps step={1} />

          <div className="mb-8 text-center">
            <Image
              src="/images/logo.webp"
              alt="DG Predict"
              className="mx-auto px-3 py-1.5 outline outline-g-3/20 bg-linear-to-r from-g-3/10 via-g-3/10 to-transparent mb-6"
              width={154}
              height={31}
            />
            <h2
              id={AUTH_TITLE_ID}
              className="text-[19px] font-extrabold text-t-1 uppercase tracking-tighter font-ibm-plex"
            >
              Authenticate
            </h2>
            <p id={AUTH_DESC_ID} className="text-[12px] tracking-tight text-t-3 font-jetbrains">
              Your terminal for prediction markets.
            </p>
          </div>

          {authError ? (
            <div className="my-3 space-y-0.5 border border-neg/40 bg-neg/10 p-2 font-jetbrains text-xs tracking-tight">
              <p role="alert" aria-live="assertive" className="text-neg">
                <span className="font-bold uppercase">Auth failure. </span>
                {authError}
              </p>
              {failedProvider ? (
                <div
                  onClick={handleRetryOAuth}
                  className="inline-flex items-center gap-1 border-b border-g-3 pb-0.5 font-jetbrains text-[11px] font-bold uppercase tracking-wide text-g-3 transition-colors hover:text-g-3/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-g-3/50 cursor-pointer"
                >
                  <ArrowRight size={12} aria-hidden="true" />
                  Retry
                </div>
              ) : null}
            </div>
          ) : null}

          <LoginOptions
            options={options}
            disabled={!ready || loadingProvider !== null}
            loadingProvider={loadingProvider}
            failedProvider={failedProvider}
          />
          {loadingProvider ? (
            <p className="sr-only" role="status" aria-live="polite">
              Opening {loadingProvider} login flow
            </p>
          ) : null}
        </div>

        {/* Footer bar */}
        <div
          className={`flex items-center justify-between border-t border-line-c/70 px-3.5 py-1.5 text-[10px] tracking-[0.16em] text-t-3/80 font-jetbrains ${BG_COLOR}`}
        >
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

const LoginOptions = memo(function LoginOptions({
  options,
  disabled,
  loadingProvider,
  failedProvider,
}: {
  options: LoginOption[]
  disabled: boolean
  loadingProvider: OAuthProvider | null
  failedProvider: OAuthProvider | null
}) {
  return (
    <div
      className="space-y-2"
      role="group"
      aria-label="Login options"
      aria-busy={loadingProvider !== null}
    >
      {options.map((option) => {
        const isFailedProvider = failedProvider !== null && option.key === failedProvider
        const isDisabled = disabled || isFailedProvider
        return (
          <button
            key={option.key}
            type="button"
            onClick={option.onClick}
            disabled={isDisabled}
            aria-label={option.label}
            aria-busy={loadingProvider === option.key}
            title={isFailedProvider ? 'Use Retry above to try this provider again' : undefined}
            className="group flex h-12 w-full items-center justify-between border border-line-c bg-bg-3/25 px-3 text-left text-t-2 transition-colors hover:border-g-3/40 hover:bg-bg-3/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-g-3/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="flex items-center gap-2.5">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-sm border border-line-c/70 ${option.iconBg}`}
              >
                {option.isWallet ? (
                  <Wallet size={14} className="text-t-1" aria-hidden="true" />
                ) : (
                  <Image
                    src={option.iconPath ?? ''}
                    alt={option.label}
                    width={14}
                    height={14}
                    priority={false}
                    loading="lazy"
                  />
                )}
              </span>
              <span className="text-[13px] font-ibm-plex">
                {loadingProvider === option.key ? 'Connecting...' : option.label}
              </span>
            </span>
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="text-t-3/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-t-3/60"
            />
          </button>
        )
      })}
    </div>
  )
})
