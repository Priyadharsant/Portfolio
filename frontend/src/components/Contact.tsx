import { type FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Send } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { cardHover, fadeUp } from '../utils/motion';
import SectionHeader from './SectionHeader';
import { apiUrl } from '../utils/api';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

type ContactProps = {
    profile: PortfolioData['profile'];
    contact: PortfolioData['contact'];
};

const Contact = ({ profile, contact }: ContactProps) => {
    const [status, setStatus] = useState<FormStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const contacts = [
        { label: profile.email, href: `mailto:${profile.email}`, icon: Mail },
        { label: 'LinkedIn', href: profile.linkedin, icon: Linkedin },
        { label: 'GitHub', href: profile.github, icon: Github },
    ];

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('loading');
        setStatusMessage('');

        const form = event.currentTarget;
        const formData = new FormData(form);
        const payload = {
            name: String(formData.get('name') ?? ''),
            email: String(formData.get('email') ?? ''),
            message: String(formData.get('message') ?? ''),
        };

        try {
            const response = await fetch(apiUrl('/api/contact'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message ?? 'Failed to send message.');
            }

            setStatus('success');
            setStatusMessage(data.message ?? 'Message sent successfully.');
            form.reset();
        } catch (error) {
            setStatus('error');
            setStatusMessage(error instanceof Error ? error.message : 'Failed to send message.');
        }
    };

    return (
        <section id="contact" className="border-b border-white/10 bg-transparent">
            <div className="section-shell">
                <SectionHeader kicker="Reach out" title="Contact" />
                <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                    <motion.div
                        className="glass-panel interactive-card rounded-lg p-6"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={cardHover}
                    >
                        <h3 className="text-2xl font-bold text-white">Get in touch</h3>
                        <p className="mt-3 leading-7 text-slate-300">
                            {contact.intro}
                        </p>
                        <div className="mt-6 space-y-3">
                            {contacts.map(({ label, href, icon: Icon }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                                    rel="noreferrer"
                                    className="relative flex items-center gap-3 rounded-md border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300 transition hover:border-teal-300 hover:bg-teal-300/10 hover:text-teal-200"
                                    whileHover={{ borderColor: 'rgba(45, 212, 191, 0.65)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Icon className="h-5 w-5 text-teal-300" />
                                    {label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        className="glass-panel interactive-card rounded-lg p-6"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: 0.1 }}
                        whileHover={cardHover}
                    >
                        <h3 className="text-2xl font-bold text-white">Send a message</h3>
                        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Your name"
                                    required
                                    className="w-full rounded-md border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-teal-300 focus:bg-slate-950"
                                />
                            </div>
                            <div>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Your email"
                                    required
                                    className="w-full rounded-md border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-teal-300 focus:bg-slate-950"
                                />
                            </div>
                            <div>
                                <textarea
                                    name="message"
                                    rows={4}
                                    placeholder="Your message"
                                    required
                                    className="w-full resize-none rounded-md border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-teal-300 focus:bg-slate-950"
                                ></textarea>
                            </div>
                            {statusMessage && (
                                <motion.p
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`rounded-md border px-4 py-3 text-sm ${status === 'success'
                                        ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                                        : 'border-red-400/30 bg-red-400/10 text-red-200'
                                        }`}
                                >
                                    {statusMessage}
                                </motion.p>
                            )}
                            <motion.button
                                type="submit"
                                disabled={status === 'loading'}
                                className="primary-action w-full px-5 py-3 disabled:cursor-not-allowed disabled:opacity-70"
                                whileHover={{ backgroundColor: '#5eead4' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.span
                                    animate={status === 'loading' ? { x: [0, 4, 0] } : { x: 0 }}
                                    transition={{ duration: 0.8, repeat: status === 'loading' ? Infinity : 0 }}
                                >
                                    <Send className="h-5 w-5" />
                                </motion.span>
                                {status === 'loading' ? 'Sending...' : 'Send Message'}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
