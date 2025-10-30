'use client';

export const dynamic = 'force-dynamic';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { sendMessageServerAction } from '../actions/sendMailServerAction';

const labelWithRequiredStar = ({ label }: { label: string }) => {
  return (
    <Label htmlFor={label.toLowerCase()}>
      <span className="flex">
        <span>{label}</span>
        <span className="text-red-500">*</span>
      </span>
    </Label>
  );
};

const ContactForm = () => {
  const [state, action, isPending] = useActionState(
    sendMessageServerAction,
    null
  );
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    message: '',
    captcha: '',
    correctCaptcha: '',
  });

  // 👇 initialize captcha AFTER hydration to avoid SSR mismatch
  const [numbers, setNumbers] = useState<{
    firstNumber: number | null;
    secondNumber: number | null;
  }>({ firstNumber: null, secondNumber: null });

  useEffect(() => {
    setNumbers({
      firstNumber: Math.floor(Math.random() * 10 + 1),
      secondNumber: Math.floor(Math.random() * 10 + 1),
    });
  }, []);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      setFormData({
        fullname: '',
        email: '',
        message: '',
        captcha: '',
        correctCaptcha: '',
      });
    }
  }, [state?.success]);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-4">
        {labelWithRequiredStar({ label: 'Name' })}
        <div className="space-y-1">
          <Input
            type="text"
            // required
            id="name"
            placeholder="Your name, your fame"
            className="px-2 py-6"
            name="fullname"
            value={formData.fullname}
            onChange={(e) =>
              setFormData({ ...formData, fullname: e.target.value })
            }
          />
          {state?.fullnameError && (
            <span className="text-sm text-red-500">{state.fullnameError}</span>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {labelWithRequiredStar({ label: 'Email' })}
        <div className="flex flex-col space-y-1">
          <Input
            type="text" // yes text
            // required
            id="email"
            placeholder="Where can I reach you back?"
            className="px-2 py-6"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <span className="text-sm text-muted-foreground">
            Temporary emails are also accepted, unless you wish to hear back 😉
          </span>
          {state?.emailError && (
            <span className="text-sm text-red-500">{state.emailError}</span>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {labelWithRequiredStar({ label: 'Message' })}
        <div className="space-y-1">
          <Textarea
            // required
            id="message"
            placeholder="Your words, my inbox."
            className="px-2 py-4"
            name="message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
          {state?.messageError && (
            <span className="text-sm text-red-500">{state.messageError}</span>
          )}
        </div>
      </div>

      {numbers.firstNumber !== null && numbers.secondNumber !== null && (
        <div className="space-y-4">
          <div className="w-full p-2 text-left rounded-md">
            <Label
              htmlFor="captcha"
              className="text-base font-bold text-red-600/70"
            >
              {numbers.firstNumber} + {numbers.secondNumber} = ?
            </Label>
            <Input
              id="captcha"
              type="number"
              min={0}
              max={25}
              placeholder="Enter the result of the calculation"
              className="px-2 py-6"
              name="captcha"
              value={formData.captcha}
              onChange={(e) => {
                setFormData({ ...formData, captcha: e.target.value });
              }}
            />
            <Input
              type="hidden"
              name="correctCaptcha"
              value={numbers.firstNumber + numbers.secondNumber}
            />

            {state?.captchaError && (
              <span className="text-sm text-red-500">{state.captchaError}</span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full px-8 py-6 cursor-pointer"
          size="lg"
          variant="default"
          disabled={isPending}
        >
          {isPending ? 'Transporting your message to my inbox... 📨' : 'Submit'}
        </Button>

        <Button
          type="reset"
          className="w-full px-8 py-6 cursor-pointer"
          size="lg"
          variant="outline"
          onClick={() =>
            setFormData({
              fullname: '',
              email: '',
              message: '',
              captcha: '',
              correctCaptcha: '',
            })
          }
        >
          Reset
        </Button>
      </div>
    </form>
  );
};
export default ContactForm;
