'use client'

import type { TextFieldClientComponent } from 'payload'
import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'

import { SocialIcon } from '@/components/SocialIcon'
import { isSocialKey, SOCIAL_META, type SocialKey } from '@/lib/socials'

function keyFromField(name?: string): SocialKey {
  if (name === 'contactEmail') return 'email'
  if (isSocialKey(name)) return name
  return 'instagram'
}

export const SocialField: TextFieldClientComponent = ({ field, path: pathFromProps, readOnly }) => {
  const path = pathFromProps || field.name
  const { disabled, errorMessage, setValue, showError, value } = useField<string>({
    path,
    potentiallyStalePath: path,
  })
  const key = keyFromField(field.name)
  const description = field.admin?.description
  const isEmail = key === 'email'

  return (
    <div className="field-type social-field">
      <FieldLabel htmlFor={path} label={field.label || SOCIAL_META[key].label} path={path} required={field.required} />
      <FieldError message={errorMessage} showError={showError} />
      <div className="social-field__control">
        <span className="social-field__icon">
          <SocialIcon name={key} />
        </span>
        <input
          id={path}
          className="social-field__input"
          type={isEmail ? 'email' : 'text'}
          inputMode={isEmail ? 'email' : 'url'}
          placeholder={isEmail ? 'hola@sitio.com' : 'https://'}
          value={typeof value === 'string' ? value : ''}
          disabled={Boolean(readOnly || disabled)}
          onChange={(event) => setValue(event.target.value || null)}
        />
      </div>
      <FieldDescription description={description} path={path} />
    </div>
  )
}
